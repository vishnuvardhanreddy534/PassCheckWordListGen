"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  generateWordlist,
  type WordlistOptions,
} from "@/app/components/wordlist-utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Download, FileText, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  baseWords: z.string().min(1, "Please provide some base words."),
  includeCaps: z.boolean().default(false),
  includeLeet: z.boolean().default(false),
  years: z.string().optional(),
  separators: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PREVIEW_LIMIT = 50;

export default function WordlistGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordlist, setWordlist] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseWords: "",
      includeCaps: true,
      includeLeet: true,
      years: new Date().getFullYear().toString(),
      separators: "-_.",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsGenerating(true);
    setWordlist([]);

    setTimeout(() => {
      const baseWordsArray = data.baseWords.split(/[\n\s,]+/).filter(Boolean);
      const options: WordlistOptions = {
        includeCaps: data.includeCaps,
        includeLeet: data.includeLeet,
        years: data.years?.split(/[\s,]+/).filter(Boolean) || [],
        separators: data.separators?.split("") || [],
      };
      const generated = generateWordlist(baseWordsArray, options);
      setWordlist(generated);
      setIsGenerating(false);
    }, 50);
  };

  const handleDownload = () => {
    const blob = new Blob([wordlist.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "passgenius_wordlist.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Custom Wordlist Generator</CardTitle>
            <CardDescription>
              Generate a targeted wordlist from your custom inputs and
              transformations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="baseWords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Words</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., names, pets, hobbies (one per line or separated by space/comma)"
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a list of base words to build your wordlist from.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="mb-4 text-lg font-medium">Transformations</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="includeCaps"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="includeCaps"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="includeCaps">Capitalization</FormLabel>
                        <FormDescription>
                          Apply various capitalizations (e.g., word, Word,
                          wORD).
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeLeet"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="includeLeet"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="includeLeet">Leetspeak</FormLabel>
                        <FormDescription>
                          Substitute letters with numbers and symbols (e.g., a →
                          4, e → 3).
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Append Years</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2023, 2024" {...field} />
                    </FormControl>
                    <FormDescription>Comma or space separated.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="separators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Separators</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., -_." {...field} />
                    </FormControl>
                    <FormDescription>Characters to join words.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch space-y-4">
            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Generate Wordlist
            </Button>

            {wordlist.length > 0 && (
              <div className="w-full space-y-4 pt-4 border-t animate-in fade-in">
                <h3 className="font-semibold">
                  Wordlist Preview (first {PREVIEW_LIMIT} of {wordlist.length})
                </h3>
                <ScrollArea className="h-48 w-full rounded-md border bg-muted/50 p-4">
                  <div className="font-mono text-sm">
                    {wordlist
                      .slice(0, PREVIEW_LIMIT)
                      .map((word, i) => (
                        <div key={i}>{word}</div>
                      ))}
                  </div>
                </ScrollArea>
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  variant="secondary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full List ({wordlist.length} words)
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
