import { redirect } from "next/navigation";

// Root page redirects to dashboard.
// The proxy.ts handles this at the edge level too.
export default function RootPage() {
  redirect("/dashboard");
}
