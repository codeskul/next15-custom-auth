"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

export const runtime = 'edge';

function UserPage() {
  const user = useCurrentUser();
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <Button asChild>
        <Link href={"/dashboard"}>Dashboard</Link>
      </Button>
    </div>
  );
}

export default UserPage;
