import { object, string } from "zod";

export const loginSchema = object({
  username: string({ required_error: "Username is required" }).min(
    1,
    "Username is required"
  ),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(32, "Password must be less than 32 characters"),
});

export const changePasswordSchema = object({
  oldPassword: string({ required_error: "Old Password is required" })
    .min(1, "Old Password is required")
    .max(32, "Old Password must be less than 32 characters"),
  newPassword: string({ required_error: "New Password is required" })
    .min(1, "New Password is required")
    .max(32, "New Password must be less than 32 characters"),
  confirmPassword: string({
    required_error: "Configm Password is required",
  })
    .min(1, "Confirm Password is required")
    .max(32, "Confirm Password must be less than 32 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Confirm Passwords don't match",
  path: ["confirmPassword"],
});
