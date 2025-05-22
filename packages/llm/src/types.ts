import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs';
import * as v from 'valibot';

// THIS NEEDS TO BE IN THE DATABASE OR ELSE SHIT WILL BREAK
export const DEFAULT_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';
export const DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant.';

export const MessageRoleSchema = v.picklist(['user', 'assistant', 'system']);
export type MessageRole = v.InferOutput<typeof MessageRoleSchema>;

export type Message = ChatCompletionCreateParamsBase['messages'][number];
export type UserMessage = Message & { role: 'user' };
export type AssistantMessage = Message & { role: 'assistant' };
export type SystemMessage = Message & { role: 'system' };
