"use client";


import Link from "next/link";
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ModeToggle } from "@/helper/darkmode";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from '@/components/ui/loading-button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { register } from "@/services/auth";


// Define the form validation schema using Zod
const signUpFormSchema = z.object({
  name: z.string().nonempty({ message: "Full name is required" }),
  username: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email({ message: "Invalid email format" }).nonempty({ message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.boolean(),
});
type ApiErrorResponse = {
  message: string;
};


type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: false
    }
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    const payload = {
      ...data,
      role: data.role ? 'seller' : 'client'
    };

    try {
      const response = await register(payload);
      console.log(response)
      toast({
        title: "Success!",
        description: "Account created successfully!",
        variant: "default",
      });
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
            description: 'Failed to create an account',
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
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="John Doe" />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="johndoe" />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="john@example.com" />
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
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">

                        <Switch id="client-seller-toggle"
                          checked={field.value}
                          onCheckedChange={field.onChange} />
                        <Label className="font-medium" htmlFor="client-seller-toggle">
                          Post your listings as a seller?
                        </Label>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <LoadingButton type="submit" className="w-full" loading={false}>Create Account</LoadingButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
