"use client";

import { createContext } from "react";

import { User } from "@/lib/auth";

export const UserContext = createContext<User | null>(null);
