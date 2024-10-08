"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import joinEvent from "./utils";

const formSchema = z.object({
    inviteCode: z.string().min(6).max(6),
    password: z.string().min(4).max(4),
})

function JoinForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            inviteCode: "",
            password: "",
        },
      });

      async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await joinEvent(values);
        if (res) {
          localStorage.setItem("token", res);
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
                    name="inviteCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invite code</FormLabel>
                            <FormControl>
                                <Input placeholder="Invite code" {...field} />
                            </FormControl>
                            <FormDescription>Enter the invite code</FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Password" {...field} />
                            </FormControl>
                            <FormDescription>Enter the password</FormDescription>
                        </FormItem>
                    )}
                />
                <Button type="submit">Join</Button>
            </form>
        </Form>
    )

}

export default function JoinPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/event");
    }
  });

  async function handleCreateEvent() {
    router.push("/create");
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold first:mt-0">
        Confnect
      </h2>
      <p>Dołącz do eventu aby kontynuować</p>
      <JoinForm/>
      <Button className="mt-2" onClick={handleCreateEvent}>Utwórz event</Button>
    </main>
  );
}
