import { AppLayout } from "@/components/layout/AppLayout";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
