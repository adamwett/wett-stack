import { CreateMessageSchema, message } from '@repo/db/schema';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';

export const messageRouter = router({
  create: publicProcedure.input(CreateMessageSchema).mutation(async ({ ctx, input }) => {
    const dbResult = ctx.db.insert(message).values({ ...input });
    // TODO: handle error gracefully, prolly will have to be async

    // call the LLM from the context, wait for the result
    const llmResult = await ctx.llm.completion([
      {
        role: 'user',
        content: input.content,
      },
    ]);

    // throw if there was an error on the AI side of things
    if (llmResult === undefined)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'LLM result is undefined',
      });

    // TODO: do something if there's more than one choice (can this happen???)
    if (llmResult.choices.length > 1) console.info('hey, idk wtf going on lol!');

    // TODO: add the LLM result to the db as a new message

    // return the LLM result back to the user
    return llmResult.choices[0]?.message.content;
  }),
});
