"use client";

import { UserContext } from "@/context/user-context";
import { User } from "@/lib/auth";

export default function UserProvider({
  children,
  user,
  ...props
}: Readonly<{
  children: React.ReactNode;
  user: User;
}>) {
  return (
    <UserContext.Provider value={user} {...props}>
      {children}
    </UserContext.Provider>
  );
}
