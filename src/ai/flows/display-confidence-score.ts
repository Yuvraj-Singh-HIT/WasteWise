'use server';

/**
 * @fileOverview Identifies waste type from an image and provides a confidence score.
 *
 * - identifyWasteAndGetConfidence - A function that handles the waste identification process and returns a confidence score.
 * - IdentifyWasteAndGetConfidenceInput - The input type for the identifyWasteAndGetConfidence function.
 * - IdentifyWasteAndGetConfidenceOutput - The return type for the identifyWasteAndGetConfidence function, including waste type and confidence score.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyWasteAndGetConfidenceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyWasteAndGetConfidenceInput = z.infer<typeof IdentifyWasteAndGetConfidenceInputSchema>;

const IdentifyWasteAndGetConfidenceOutputSchema = z.object({
  wasteType: z.string().describe('The identified type of waste (e.g., plastic, paper, glass, organic).'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A score between 0 and 1 indicating the confidence level of the waste identification.'),
});
export type IdentifyWasteAndGetConfidenceOutput = z.infer<typeof IdentifyWasteAndGetConfidenceOutputSchema>;

export async function identifyWasteAndGetConfidence(
  input: IdentifyWasteAndGetConfidenceInput
): Promise<IdentifyWasteAndGetConfidenceOutput> {
  return identifyWasteAndGetConfidenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyWasteAndGetConfidencePrompt',
  input: {schema: IdentifyWasteAndGetConfidenceInputSchema},
  output: {schema: IdentifyWasteAndGetConfidenceOutputSchema},
  prompt: `You are an AI expert in waste identification and segregation.

  Analyze the image of the waste item and identify its type (e.g., plastic, paper, glass, organic).
  Also, provide a confidence score (between 0 and 1) indicating how certain you are about the identification.

  Return the waste type and confidence score in JSON format.

  Image: {{media url=photoDataUri}}
  `,
});

const identifyWasteAndGetConfidenceFlow = ai.defineFlow(
  {
    name: 'identifyWasteAndGetConfidenceFlow',
    inputSchema: IdentifyWasteAndGetConfidenceInputSchema,
    outputSchema: IdentifyWasteAndGetConfidenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
