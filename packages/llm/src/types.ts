import * as v from 'valibot';

export const ModelNameSchema = v.picklist(['google/gemini-2.0-flash-exp:free']);

export type ModelName = v.InferOutput<typeof ModelNameSchema>;
