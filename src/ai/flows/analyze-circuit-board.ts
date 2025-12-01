'use server';

/**
 * @fileOverview An AI flow for identifying and locating electronic components on a circuit board.
 *
 * - analyzeCircuitBoard - A function that handles the component identification process.
 * - AnalyzeCircuitBoardInput - The input type for the analyzeCircuitBoard function.
 * - AnalyzeCircuitBoardOutput - The return type for the analyzeCircuitBoard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCircuitBoardInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a circuit board, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCircuitBoardInput = z.infer<typeof AnalyzeCircuitBoardInputSchema>;

const ComponentSchema = z.object({
    componentName: z.string().describe('The common name of the electronic component (e.g., "Capacitor", "CPU", "Resistor").'),
    description: z.string().describe('A brief, one-sentence description of the component\'s function.'),
    boundingBox: z.object({
        x: z.number().describe('The x-coordinate of the top-left corner of the bounding box, as a percentage of the image width.'),
        y: z.number().describe('The y-coordinate of the top-left corner of the bounding box, as a percentage of the image height.'),
        width: z.number().describe('The width of the bounding box, as a percentage of the image width.'),
        height: z.number().describe('The height of the bounding box, as a percentage of the image height.'),
    }).describe('The bounding box locating the component within the image, with coordinates and dimensions as percentages (0-100).'),
});


const AnalyzeCircuitBoardOutputSchema = z.object({
  components: z.array(ComponentSchema).describe('An array of electronic components identified on the circuit board.'),
});
export type AnalyzeCircuitBoardOutput = z.infer<typeof AnalyzeCircuitBoardOutputSchema>;

export async function analyzeCircuitBoard(
  input: AnalyzeCircuitBoardInput
): Promise<AnalyzeCircuitBoardOutput> {
  return analyzeCircuitBoardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCircuitBoardPrompt',
  input: {schema: AnalyzeCircuitBoardInputSchema},
  output: {schema: AnalyzeCircuitBoardOutputSchema},
  prompt: `You are an expert electronics engineer with advanced computer vision capabilities. Your task is to analyze the provided image of a printed circuit board (PCB).

  Identify all significant electronic components visible in the image. For each component you identify, you must provide:
  1.  The common name of the component (e.g., "CPU", "Capacitor", "Resistor", "Inductor", "Crystal Oscillator").
  2.  A brief, one-sentence description of its primary function.
  3.  A precise bounding box for the component. The coordinates (x, y) and dimensions (width, height) of the bounding box must be expressed as percentages of the total image dimensions. For example, a component starting 10% from the left and 20% from the top, with a width of 5% and height of 2%, would have boundingBox: { x: 10, y: 20, width: 5, height: 2 }.

  Return the result as a JSON object containing a list of all identified components.

  Image of the circuit board: {{media url=photoDataUri}}
  `,
});

const analyzeCircuitBoardFlow = ai.defineFlow(
  {
    name: 'analyzeCircuitBoardFlow',
    inputSchema: AnalyzeCircuitBoardInputSchema,
    outputSchema: AnalyzeCircuitBoardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
