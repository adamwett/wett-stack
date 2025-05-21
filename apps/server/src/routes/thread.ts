import { publicProcedure, router } from '@repo/api';
import { TRPCError } from '@repo/api';
import { asc, desc, eq } from '@repo/db/drizzle';
import type { Message, MessageRole } from '@repo/llm';
import * as v from 'valibot';
import { DEFAULT_SYSTEM_PROMPT } from '#/schemas/agents';
import { DEFAULT_MODEL, ModelNameSchema } from '#/schemas/models';
import { messages, threads } from '#/schemas/threads';
import { uuid } from '#/utils';

// The frontend should keep track of what agent is selected for each thread we can assume that it knows what the default agent is, and the model that it wants to use. This way we aren't running tons of queries every time we want to send a message

// Might want to test how the performance changes if we just fetch the thread id

const ThreadNewMessageSchema = v.object({
  threadId: v.optional(v.string()),
  systemPrompt: v.optional(v.string()),
  model: v.optional(ModelNameSchema),
  content: v.string(),
});

export const threadRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const allThreads = await ctx.db.select().from(threads).orderBy(desc(threads.createdAt));
    console.log(`got ${allThreads.length} threads`);
    return allThreads;
  }),
  one: publicProcedure.input(v.object({ id: v.string() })).query(async ({ ctx, input }) => {
    console.log('one input: ', input);
    const thread = await ctx.db
      .select()
      .from(threads)
      .where(eq(threads.id, input.id))
      .limit(1)
      .then((r) => r[0]);
  }),
  appendMessage: publicProcedure.input(ThreadNewMessageSchema).mutation(async ({ ctx, input }) => {
    console.log('input ', input);

    //
    // 0. Use defaults if the user doesn't provide them
    //

    const systemPrompt = input.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
    const model = input.model ?? DEFAULT_MODEL;

    //
    // 1. See if we need to make a new thread or not
    //

    const threadId: string = await (async () => {
      // If the thread already exists, then we can just return the thread id
      if (input.threadId !== undefined) return input.threadId;

      // Make a new thread
      const newThread = await ctx.db
        .insert(threads)
        .values({
          id: uuid(),
          model,
          systemPrompt,
        })
        .returning();

      // If the thread creation failed, then we should throw an error
      if (newThread[0] === undefined) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create thread' });
      }

      return newThread[0].id;
    })();

    //
    // 3. Combine the system prompt + existing conversation + new message
    // 		We do this before storing the userMessage to avoid duplicating it
    //

    const existingConvo: Message[] = await (async () => {
      if (input.threadId === undefined) return [];
      return (
        await ctx.db.select().from(messages).where(eq(messages.threadId, threadId)).orderBy(asc(messages.createdAt))
      ).map((m) => ({ content: m.content, role: m.role }));
    })();

    const newConvo: Message[] = [
      { role: 'system', content: systemPrompt },
      ...existingConvo,
      { content: input.content, role: 'user' },
    ];

    console.log('newConvo', newConvo);

    //
    // 4. Send the new conversation to the LLM
    //

    const askAgentResult = (await ctx.llm.completion(newConvo, model)).choices[0]?.message.content;

    if (!askAgentResult) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Agent returned no result' });

    //
    // 5. Store a message for the assistant & the user
    //

    // TODO: maybe make sure if the assistant replied they don't send the same message twice
    const userMessage = (
      await ctx.db
        .insert(messages)
        .values({
          id: uuid(),
          content: input.content,
          role: 'user',
          threadId: threadId,
        })
        .returning()
    )[0];

    if (userMessage === undefined)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create message' });

    const assistantMessage = (
      await ctx.db
        .insert(messages)
        .values({
          id: uuid(),
          content: askAgentResult,
          role: 'assistant',
          threadId: threadId,
        })
        .returning()
    )[0];

    if (assistantMessage === undefined)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create assistant message' });

    // return the original message + the assistant message
    return [userMessage, assistantMessage];
  }),
});
