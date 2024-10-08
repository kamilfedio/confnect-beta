"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEvent, getQuestions, sendQuestion } from "./utils";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Transmit } from "@adonisjs/transmit-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CONFIG from "@/config/app_config";
import { Terminal } from "lucide-react";
interface Question {
  id: number;
  content: string;
  context: string;
}

const transmit = new Transmit({
  baseUrl: CONFIG.API_URL + "/events",
});

function DisplayAlert({ message, desc }: { message: string; desc: string }) {
  return (
    <>
      <Alert className="mt-2">
        <Terminal className="h-4 w-4"/>
          <AlertTitle className="text-left ">{message}</AlertTitle>
          <AlertDescription className="text-left">{desc}</AlertDescription>
      </Alert>
    </>
  );
}

function DisplayCarousel({ questions }: { questions: Question[] }) {
  return (
    <>
      {questions.length > 0 && (
        <Carousel className="w-full max-w-2xl pt-1 mt-3">
          <CarouselContent>
            {questions.map((question) => (
              <CarouselItem key={`question-${question.id}`}>
                <div className="">
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-6 flex-col">
                      <span className="text-2xl font-semibold">
                        {question['content']}
                      </span>
                      <p>{question["context"]}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </>
  );
}

function DisplayQuestionInput() {
  const formSchema = z.object({
    content: z.string().min(2),
    context: z.string().min(2),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      context: "",
    },
  });

  async function onSubmit(value: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token");
    if (token) {
      await sendQuestion(token, value);
    }
    form.resetField("content");
    form.resetField("context");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea placeholder="Question" {...field} />
              </FormControl>
              <FormDescription>Enter the question</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context</FormLabel>
              <FormControl>
                <Textarea placeholder="Context" {...field} />
              </FormControl>
              <FormDescription>Enter the context</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default function EventPage() {
  const [eventModel, setEventModel] = useState(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAlert, setIsAlert] = useState(false);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/create");
  }

  useEffect(() => {
    async function fetchEvent() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/create");
      } else {
        const event = await getEvent(token);
        setEventModel(event);
        const receivedQuestions = await getQuestions(token);
        const newQuestions = receivedQuestions.map((question: Question) => {
          return {
            id: question.id,
            content: question.content,
            context: question.context,
          };
        });
        setQuestions(newQuestions);
      }
    }
    fetchEvent();
  }, [router]);

  useEffect(() => {
    if (eventModel && localStorage.getItem("role") === "admin") {
      const subscription = transmit.subscription(
        `events/${eventModel["id"]}/questions`
      );

      subscription.create().then(() => {
        subscription.onMessage((data: any) => {
          const questionData = data["question"];
          const newQuestion = {
            id: questionData.id,
            content: questionData.content,
            context: questionData.context,
          };
          setQuestions((prevQuestions) => {
            const current_ids = prevQuestions.map((q) => q.id);
            if (!current_ids.includes(newQuestion.id)) {
              setIsAlert(true)
              setTimeout(() => {
                setIsAlert(false)
              }, 3000)
              return [...prevQuestions, newQuestion];
            }
            return prevQuestions;
          });
        });
      });

      return () => {
        subscription.delete();
      };
    }
  }, [eventModel]);

  return (
    <main className="flex justify-center flex-col h-screen items-center">
      <div className="flex flex-col items-center text-center">
        {eventModel && (
          <div>
            <h2 className="text-3xl font-medium">{eventModel["name"]}</h2>
            <p className=" font-light text-muted-foreground">
              {eventModel["description"]}
            </p>
            <p className="text-sm font-medium leading-none py-2.5">
              Aby dołączyć wejdź na stronę: https://confnect.pl/join
            </p>
            <p className="text-sm">
              Kod dołączenia: {eventModel["inviteCode"]}
            </p>
            <p className="text-sm">Hasło: {eventModel["userPassword"]}</p>
          </div>
        )}
        {localStorage.getItem("role") === "admin" ? (
          <DisplayCarousel questions={questions} />
        ) : (
          <DisplayQuestionInput />
        )}
        <Button variant="secondary" className="mt-5" onClick={handleLogout}>
          Wyloguj
        </Button>
        {isAlert && localStorage.getItem("role") === "admin" && (
          <DisplayAlert message="Nowe pytanie" desc="Ktoś zadał nowe pytanie" />
        )}
      </div>
    </main>
  );
}
