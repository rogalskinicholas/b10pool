import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        That ride may have been removed, or the link is wrong.
      </p>
      <Button render={<Link href="/rides" />}>Browse rides</Button>
    </Container>
  );
}
