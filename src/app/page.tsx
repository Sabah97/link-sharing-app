import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="font-bold">
            ShareAble
          </Link>
          <nav className="ml-auto flex gap-4">
            <Link href="/dashboard">
              <Button className="hover:cursor-pointer" variant="default">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              Share all your links in one place
            </h1>
            <p className="mt-4 text-muted-foreground">
              Create and customize your link sharing profile with devlinks
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button className="hover:cursor-pointer" size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
