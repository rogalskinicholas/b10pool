import { Container } from "@/components/layout/container";

export default function AuthLayout({ children }: LayoutProps<"/"> ) {
  return (
    <Container className="flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-sm">{children}</div>
    </Container>
  );
}
