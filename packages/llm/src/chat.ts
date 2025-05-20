import OpenAI from 'openai';
import type { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import * as v from 'valibot';

// TYPES:
export const MessageRoleSchema = v.picklist(['user', 'assistant', 'system']);
export type MessageRole = v.InferOutput<typeof MessageRoleSchema>;

// type aliases for readability
export type Message = ChatCompletionCreateParamsBase['messages'][number];
export type UserMessage = Message & { role: 'user' };
export type AssistantMessage = Message & { role: 'assistant' };
export type SystemMessage = Message & { role: 'system' };
export type LLMInstance = ReturnType<typeof createLLM>;

/** Makes a client with the api key & our settings */
const clientMaker = (apiKey: string) =>
  new OpenAI({
    apiKey,
    // Default settings go here
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      // optional site headers for openrouter rankings :D
      'HTTP-Referer': 'https://agent-smith.wett.dev/',
      'X-Title': 'Agent Smith',
    },
  });

/** Makes a function that can be used to create completions AKA send messages to the LLM */
const completionMaker = (client: OpenAI) => (messages: Message[], model: string) => {
  console.log('model', model);
  const completion = client.chat.completions.create({
    model,
    messages,
  });
  return completion;
};

/** Makes a function that can be used to stream completions */
const streamMaker = (client: OpenAI) => (messages: Message[], model: string) => {
  const stream = client.beta.chat.completions.stream({
    model,
    messages,
  });
  return stream;
};

export const createLLM = (apiKey: string) => {
  const client = clientMaker(apiKey);

  return {
    completion: completionMaker(client),
    stream: streamMaker(client),
  };
};
