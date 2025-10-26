'use server';

/**
 * @fileOverview A password strength analysis AI agent.
 *
 * - analyzePasswordStrength - A function that handles the password analysis process.
 * - AnalyzePasswordStrengthInput - The input type for the analyzePasswordStrength function.
 * - AnalyzePasswordStrengthOutput - The return type for the analyzePasswordStrength function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePasswordStrengthInputSchema = z.object({
  password: z.string().describe('The password to analyze.'),
});
export type AnalyzePasswordStrengthInput = z.infer<typeof AnalyzePasswordStrengthInputSchema>;

const AnalyzePasswordStrengthOutputSchema = z.object({
  strength: z.number().describe('The strength score of the password (0-4).'),
  entropy: z.number().describe('The entropy of the password in bits.'),
  feedback: z.string().describe('Feedback on how to improve the password.'),
});
export type AnalyzePasswordStrengthOutput = z.infer<typeof AnalyzePasswordStrengthOutputSchema>;

export async function analyzePasswordStrength(input: AnalyzePasswordStrengthInput): Promise<AnalyzePasswordStrengthOutput> {
  return analyzePasswordStrengthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePasswordStrengthPrompt',
  input: {schema: AnalyzePasswordStrengthInputSchema},
  output: {schema: AnalyzePasswordStrengthOutputSchema},
  prompt: `You are a password security expert. Analyze the strength of the given password and provide feedback.

Password: {{{password}}}

Provide a strength score (0-4), the entropy in bits, and feedback on how to improve the password.  The output should be in JSON format. Make the feedback actionable and specific to the provided password. Focus on weaknesses and how to address them, such as length, character diversity, and common patterns. If the password is very short, then state that length is the primary issue to address.
`,
});

const analyzePasswordStrengthFlow = ai.defineFlow(
  {
    name: 'analyzePasswordStrengthFlow',
    inputSchema: AnalyzePasswordStrengthInputSchema,
    outputSchema: AnalyzePasswordStrengthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
