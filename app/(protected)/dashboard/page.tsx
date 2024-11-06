import LogoutButton from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export const runtime = 'edge';

export default async function DashboardPage() {
  const session = await getUser();

  return (
    <div>
      <p>Dashboard Page</p>
      <pre>{JSON.stringify(session)}</pre>
      <LogoutButton />
      <Button asChild>
        <Link href={"/user"}>User</Link>
      </Button>
    </div>
  );
}
