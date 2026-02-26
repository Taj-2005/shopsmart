import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-muted flex items-center justify-center">
      <Container as="div" className="py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-primary">
          Access denied
        </h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/home"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-accent px-6 text-sm font-medium text-on-accent hover:bg-accent/90"
          >
            Go to store
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] border-2 border-border bg-surface px-6 text-sm font-medium text-primary hover:bg-muted"
          >
            Log in
          </Link>
        </div>
      </Container>
    </main>
  );
}
