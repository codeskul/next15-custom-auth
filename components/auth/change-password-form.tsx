"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { changePasswordSchema } from "@/lib/zod";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { changePassword } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput } from "../custom/password-input";

import { logout } from "@/actions/auth";

export function ChangePasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    console.log(values);
    startTransition(async () => {
      await changePassword(values).then((data: any) => {
        if (data?.success) {
          toast({
            variant: "default",
            title: data.msg,
          });
          router.push(
            callbackUrl
              ? `/auth/login?transactionCode=${data.mtrans}&callbackUrl=${callbackUrl}`
              : `/auth/login?transactionCode=${data.mtrans}`
          );
        } else if (data?.error) {
          form.reset();
          toast({
            variant: "destructive",
            title: data.error,
          });
        }
      });
    });
  };

  const backToLogin = async () => {
    await logout(callbackUrl);
  };

  return (
    <div className="grid gap-6 mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Change Password
          </Button>
          <Button
            type="button"
            onClick={backToLogin}
            variant={"ghost"}
            className="w-full"
          >
            Back to Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
