import { logout } from "@/actions/auth";
import { getToken } from "./auth";

const debug = require("debug")("app:lib/http.ts");

export async function AuthApiCall(endpoint: string, params: any) {
  //   try {
  const token = await getToken();
  //   debug("token %O", token);
  if (!token) {
    await logout();
  }
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `bearer ${token}`,
  };
  debug(headers);
  const res = await fetch(`${process.env.API_URL}/api/${endpoint}`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(params),
  });
  const response = await res.json();
  debug(response);
  if (response?.status === 401) {
    await logout();
  } else {
    return response;
  }
  //   } catch (error) {
  //     debug("AuthApiCall Error :: %O", error);
  //   }
}
