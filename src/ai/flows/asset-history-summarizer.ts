'use server';
/**
 * @fileOverview An AI agent that summarizes an asset's audit history.
 *
 * - summarizeAssetHistory - A function that handles the asset history summarization process.
 * - AssetHistorySummarizerInput - The input type for the summarizeAssetHistory function.
 * - AssetHistorySummarizerOutput - The return type for the summarizeAssetHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema Definition
const AssetHistoryEntrySchema = z.object({
  id: z.number().describe('Unique identifier for the history entry.'),
  asset_id: z.number().describe('ID of the asset this history belongs to.'),
  jenis_perolehan_lama: z.string().describe('The previous acquisition type of the asset.'),
  jenis_perolehan_baru: z.string().describe('The new acquisition type of the asset.'),
  tarikh_tukar: z.string().describe('The date when the change occurred (YYYY-MM-DD format).'),
  ditukar_oleh: z.string().describe('The user who made the change.'),
  catatan: z.string().optional().describe('Optional notes about the change.'),
});

const AssetHistorySummarizerInputSchema = z.object({
  assetId: z.number().describe('The ID of the asset whose history is being summarized.'),
  assetHistory: z.array(AssetHistoryEntrySchema).describe('An array of audit trail entries for the asset.'),
});
export type AssetHistorySummarizerInput = z.infer<typeof AssetHistorySummarizerInputSchema>;

// Output Schema Definition
const AssetHistorySummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise AI-generated summary of the asset\'s lifecycle.'),
});
export type AssetHistorySummarizerOutput = z.infer<typeof AssetHistorySummarizerOutputSchema>;

// Exported wrapper function
export async function summarizeAssetHistory(input: AssetHistorySummarizerInput): Promise<AssetHistorySummarizerOutput> {
  return assetHistorySummarizerFlow(input);
}

// Prompt Definition
const assetHistorySummaryPrompt = ai.definePrompt({
  name: 'assetHistorySummaryPrompt',
  input: {schema: AssetHistorySummarizerInputSchema},
  output: {schema: AssetHistorySummarizerOutputSchema},
  prompt: `You are an expert IT asset administrator. Your task is to analyze the provided asset audit history and generate a concise summary of the asset\'s lifecycle. Highlight key events, changes in acquisition type (jenis_perolehan_lama to jenis_perolehan_baru), and any significant notes or trends.

Asset ID: {{{assetId}}}

Asset History Entries:
{{#each assetHistory}}
- ID: {{{id}}}, Changed on: {{{tarikh_tukar}}}
  Previous Acquisition Type: "{{{jenis_perolehan_lama}}}"
  New Acquisition Type: "{{{jenis_perolehan_baru}}}"
  Changed By: "{{{ditukar_oleh}}}"
  Notes: "{{{catatan}}}"
{{/each}}

Please provide a concise, easy-to-understand summary of this asset\'s history in 2-3 paragraphs. Focus on the most important events and how the asset\'s acquisition type evolved over time.`,
});

// Flow Definition
const assetHistorySummarizerFlow = ai.defineFlow(
  {
    name: 'assetHistorySummarizerFlow',
    inputSchema: AssetHistorySummarizerInputSchema,
    outputSchema: AssetHistorySummarizerOutputSchema,
  },
  async (input) => {
    const {output} = await assetHistorySummaryPrompt(input);
    return output!;
  }
);
