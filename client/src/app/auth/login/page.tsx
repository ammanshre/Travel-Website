"use client";

import Link from "next/link"
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ModeToggle } from "@/helper/darkmode";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { login } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast"
import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/useUserData';



// Define the form validation schema using Zod
const loginFormSchema = z.object({
  username: z.string().nonempty({ message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;



export default function Login() {
  const { setUserData, getUserData, clearUserData } = useAuth();

  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await login({ username, password });
      toast({
        title: "Success!",
        description: "Account logged in successfully!",
        variant: "default",
      });
      
      setUserData(response);
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        try {
          const errorDetails = JSON.parse(error.message);
          const message = Array.isArray(errorDetails.message) ? errorDetails.message.join(", ") : errorDetails.message;
          toast({
            title: "Error",
            description: message || 'Failed to create an account',
            variant: "destructive",
          });
        } catch (jsonError) {
          toast({
            title: "Error",
            description: 'Failed to create login',
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: 'An unexpected error occurred',
          variant: "destructive",
        });
      }
    } finally {
      form.reset();
      setLoading(false);
    }
  };


  return (
    <div className=" h-screen">
      <div className="flex items-center justify-center flex-col ">
        <div className="self-start mb-16 mt-3 flex justify-between w-full">
          <Link href="/">
            <Button className="mx-3">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="mx-3">
            <ModeToggle />
          </div>
        </div>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>username</FormLabel>
                      <FormControl>
                        <Input {...field} type="username" placeholder="example@example.com" />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Password" />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                {loginError && (
                  <FormItem>
                    <FormDescription className="text-red-500">{loginError}</FormDescription>
                  </FormItem>
                )}
                <div className="flex justify-center">
                  <LoadingButton type="submit" className="w-full" loading={loading}>Login</LoadingButton>
                </div>
                <div className="mt-4 text-center">
                  <Link href="/forgot-password" className="text-sm underline">Forgot password?</Link>
                </div>
                <div className="text-center text-sm">
                  Don’t have an account? <Link href="/signup" className="underline">Sign up</Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}
