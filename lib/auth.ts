// const debug = require("debug")("app:lib/auth.ts");
// const errLog = require("debug")("err:lib/auth.ts");

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { hour } from "./utils";

const secretKey = process.env.AUTH_SECRET || "jwt-secret-key";
const key = new TextEncoder().encode(secretKey);

export type User = {
  uname?: string;
  bcode?: string;
  isFirstLogin?: boolean;
  auth?: number;
  token?: string;
  isLoggedIn: boolean;
};

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  const data = await decrypt(session);
  return data?.user;
}

export async function getToken() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  const data = await decrypt(session);
  return data?.user?.token;
}

export async function saveSession(user: any, expires: Date): Promise<any> {
  // Create the session

  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  const cookieStore = await cookies();
  return cookieStore.set("session", session, { expires, httpOnly: true });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 1 * hour);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

// export async function login(formData: FormData) {
//   // Verify credentials && get the user

//   const user = { email: formData.get("email"), name: "John" };

//   // Create the session
//   const expires = new Date(Date.now() + 10 * 1000);
//   const session = await encrypt({ user, expires });

//   // Save the session in a cookie
//   const cookieStore = await cookies();
//   cookieStore.set("session", session, { expires, httpOnly: true });
// }

export async function doLogin(username: string, password: string) {
  try {
    const payload = {
      uname: username,
      pass: password,
    };
    const res = await fetch(`${process.env.API_URL}/api/login/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.log("Login Error :: ", error);
    // errLog("Login Error :: %O", error);
    return { error: error };
    // return { error: "Something went wrong in api call" };
  }
}

export async function doLogout() {
  // Destroy the session
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}
