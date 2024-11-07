"use server";

// const debug = require("debug")("app:actions/auth.ts");

import { z } from "zod";
import { changePasswordSchema, loginSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { doLogin, saveSession } from "@/lib/auth";
import { hour, minute } from "@/lib/utils";
import { doLogout } from "@/lib/auth";
import { AuthApiCall } from "@/lib/http";

export const login = async (
  values: z.infer<typeof loginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password } = validatedFields.data;

  let userRes = await doLogin(username, password);

  if (userRes?.error) return userRes;
  if (userRes) {
    // debug("userRes :: %O", userRes);

    if (userRes?.status === 200) {
      const { data } = userRes;
      //   debug("userRes :: %O", data);
      const { t1, t2 } = data;
      // debug("t1 %O", t1);
      // debug("t2 %O", t2);
      const { uname, bcode, isflogin, auth, token } = t1;

      const user: any = {};
      let expires = new Date(Date.now() + 1 * minute);
      if (isflogin) {
        user.isLoggedIn = false;
        user.isFirstLogin = isflogin;
        user.token = token;
      } else {
        user.isLoggedIn = true;
        user.uname = uname;
        user.bcode = bcode;
        user.isFirstLogin = isflogin;
        user.auth = auth;
        user.token = token;
        expires = new Date(Date.now() + 24 * hour);
      }

      await saveSession(user, expires);

      if (isflogin) {
        redirect(
          callbackUrl
            ? `/auth/change-password?callbackUrl=${encodeURIComponent(
                callbackUrl
              )}`
            : "/auth/change-password"
        );
      } else {
        redirect(callbackUrl || DEFAULT_LOGIN_REDIRECT);
      }
    } else if (userRes?.status === 300) {
      return { error: userRes.msg };
    } else if (userRes?.status === 400) {
      return { error: userRes.msg };
    } else {
      return { error: "Something went wrong!" };
    }
  }
};

export const logout = async (callbackUrl?: string | null) => {
  // Some server stuff
  await doLogout();

  redirect(
    callbackUrl
      ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/auth/login"
  );
};

export const changePassword = async (
  values: z.infer<typeof changePasswordSchema>
) => {
  const validatedFields = changePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { oldPassword, newPassword } = validatedFields.data;

  let apiRes = await AuthApiCall("login/changepassfirst", {
    pass: oldPassword,
    newpass: newPassword,
  });

  if (apiRes.error) return apiRes;
  if (apiRes) {
    // debug("apiRes :: %O", apiRes);
    const { status } = apiRes;
    if (status === 200) {
      const { data, msg } = apiRes;
      //   debug("apiRes :: %O", data);
      const { mtrans } = data;

      return { success: true, msg, mtrans };

      // redirect(
      //   callbackUrl
      //     ? `/auth/login?transactionCode=${mtrans}&callbackUrl=${encodeURIComponent(
      //         callbackUrl
      //       )}`
      //     : `/auth/login?transactionCode=${mtrans}`
      // );
    } else if (status === 300) {
      return { error: apiRes.msg };
    } else {
      return { error: "Something went wrong!" };
    }
  }
};
