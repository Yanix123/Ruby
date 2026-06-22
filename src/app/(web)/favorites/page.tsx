import { redirect } from "next/navigation";
import { getSession } from "@/pkg/auth/auth";
import { FavoritesModule } from "@/modules/favorites";

export default async function FavoritesPage() {
  // Authoritative server-side guard (proxy.ts is only an optimistic first layer).
  const session = await getSession();
  if (!session) redirect("/login");
  return <FavoritesModule userId={session.user.id} />;
}
