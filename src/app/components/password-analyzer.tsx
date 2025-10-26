"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { analyzePasswordStrengthAction } from "@/app/actions/analyze-password";
import { type AnalyzePasswordStrengthOutput } from "@/ai/flows/password-strength-analysis";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  password: z.string().min(1, "Password cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

export default function PasswordAnalyzer() {
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] =
    useState<AnalyzePasswordStrengthOutput | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setAnalysis(null);
    startTransition(async () => {
      const result = await analyzePasswordStrengthAction(data.password);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        });
      } else {
        setAnalysis(result.data);
      }
    });
  };

  const strengthText = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Very Strong",
  ];
  const strengthColorClasses = [
    "text-chart-1",
    "text-chart-2",
    "text-chart-3",
    "text-chart-4",
    "text-chart-5",
  ];
  const strengthProgressColorClasses = [
    "[&>div]:bg-chart-1",
    "[&>div]:bg-chart-2",
    "[&>div]:bg-chart-3",
    "[&>div]:bg-chart-4",
    "[&>div]:bg-chart-5",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Strength Analyzer</CardTitle>
        <CardDescription>
          Enter a password to analyze its strength and get feedback from our AI
          expert.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Analyze Password
            </Button>
          </form>
        </Form>

        {isPending && (
          <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Our AI is analyzing your password...
            </p>
          </div>
        )}

        {analysis && (
          <div className="mt-6 space-y-4 animate-in fade-in">
            <h3 className="font-semibold">Analysis Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Strength</span>
                <span
                  className={`font-semibold ${
                    strengthColorClasses[analysis.strength]
                  }`}
                >
                  {strengthText[analysis.strength]}
                </span>
              </div>
              <Progress
                value={(analysis.strength / 4) * 100}
                className={`h-3 ${
                  strengthProgressColorClasses[analysis.strength]
                }`}
                aria-label={`Password strength: ${
                  strengthText[analysis.strength]
                }`}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Entropy</span>
              <span className="font-mono">{analysis.entropy.toFixed(2)} bits</span>
            </div>
            <div>
              <h4 className="font-medium">AI Feedback</h4>
              <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md mt-2">
                {analysis.feedback}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
