"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

function LogoutButton() {
  const pathname = usePathname();

  const doLogout = async () => {
    await logout(pathname);
  };
  return <Button onClick={doLogout}>Logout</Button>;
}

export default LogoutButton;
