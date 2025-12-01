'use server';

/**
 * @fileOverview Waste type identification flow using computer vision.
 *
 * - identifyWasteType - A function that handles waste identification based on an image.
 * - IdentifyWasteTypeInput - The input type for the identifyWasteType function.
 * - IdentifyWasteTypeOutput - The return type for the identifyWasteType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyWasteTypeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyWasteTypeInput = z.infer<typeof IdentifyWasteTypeInputSchema>;

const IdentifyWasteTypeOutputSchema = z.object({
  wasteType: z.string().describe('The identified type of waste (e.g., plastic, paper, glass, organic).'),
  confidence: z.number().describe('The confidence score of the waste identification (0-1).'),
});
export type IdentifyWasteTypeOutput = z.infer<typeof IdentifyWasteTypeOutputSchema>;

export async function identifyWasteType(input: IdentifyWasteTypeInput): Promise<IdentifyWasteTypeOutput> {
  return identifyWasteTypeFlow(input);
}

const identifyWasteTypePrompt = ai.definePrompt({
  name: 'identifyWasteTypePrompt',
  input: {schema: IdentifyWasteTypeInputSchema},
  output: {schema: IdentifyWasteTypeOutputSchema},
  prompt: `You are an AI assistant specialized in identifying the type of waste in a given image.
  Analyze the image and determine the waste type. Waste types can be plastic, paper, glass, organic, or other.
  Return the waste type and a confidence score (0-1) indicating the accuracy of the identification.
  
  Here is the image of the waste item: {{media url=photoDataUri}}
  
  Output in JSON format:
  {
    "wasteType": "the identified waste type",
    "confidence": confidence score as a number between 0 and 1
  }`,
});

const identifyWasteTypeFlow = ai.defineFlow(
  {
    name: 'identifyWasteTypeFlow',
    inputSchema: IdentifyWasteTypeInputSchema,
    outputSchema: IdentifyWasteTypeOutputSchema,
  },
  async input => {
    const {output} = await identifyWasteTypePrompt(input);
    return output!;
  }
);
