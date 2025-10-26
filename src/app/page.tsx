import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";
import PasswordAnalyzer from "@/app/components/password-analyzer";
import WordlistGenerator from "@/app/components/wordlist-generator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background text-foreground">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl sm:text-5xl font-bold ml-3">
              PassGenius
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your smart password security toolkit.
          </p>
        </header>

        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyzer">Password Analyzer</TabsTrigger>
            <TabsTrigger value="generator">Wordlist Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="analyzer">
            <PasswordAnalyzer />
          </TabsContent>
          <TabsContent value="generator">
            <WordlistGenerator />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Security Notice: All processing is done in-memory. We do not store
            your data.
          </p>
          <p>&copy; {new Date().getFullYear()} PassGenius. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
