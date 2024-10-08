"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import createEvent from "./utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { token, role } = await createEvent(values);
    console.log(token, role);
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      router.push("/event")

    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/3 space-y-6 flex justify-center flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event name</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the event</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event description</FormLabel>
              <FormControl>
                <Input placeholder="Event description" {...field} />
              </FormControl>
              <FormDescription>
                Enter a description of the event
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>Enter your email address</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-1/2 flex self-center">
          Stwórz event
        </Button>
      </form>
    </Form>
  );
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/event");
    }
  });

  function handleJoinEvent() {
    router.push("/join");
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold first:mt-0">
        Confnect
      </h2>
      <p>Stwórz event aby kontynuować</p>
      <RegisterForm />
      <Button className="mt-2" onClick={handleJoinEvent}>Dołącz do istniejącego eventu</Button>
    </main>
  );
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  email: z.string().email(),
});
