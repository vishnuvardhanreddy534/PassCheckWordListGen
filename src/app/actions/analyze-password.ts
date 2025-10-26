"use server";

import { config } from 'dotenv';
config();

import {
  analyzePasswordStrength,
  type AnalyzePasswordStrengthOutput,
} from "@/ai/flows/password-strength-analysis";

export async function analyzePasswordStrengthAction(
  password: string
): Promise<{ data: AnalyzePasswordStrengthOutput | null; error: string | null }> {
  if (!password) {
    return { data: null, error: "Password is required." };
  }

  try {
    const analysis = await analyzePasswordStrength({ password });
    return { data: analysis, error: null };
  } catch (e) {
    console.error("Password analysis failed:", e);
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred.";
    return {
      data: null,
      error: `Failed to analyze password. ${errorMessage}`,
    };
  }
}
