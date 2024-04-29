"use client";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/apiResponse";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";

const Page = () => {
  const param = useParams();

  const MessageSchema = z.object({
    message: messageSchema,
  });

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      const response = await axios.post(`/api/send-message`, {
        username: param.username,
        content: data.message,
      });
      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Could not send message"
      );
    }
  };

  return (
    <div className="w-full sm:w-8/12 mx-auto px-4">
      <h1 className="text-4xl text-center font-bold mt-8">
        Public Profile Link
      </h1>
      <div>
        <p className="mt-8">
          Send anonymous message to{" "}
          <span className="font-medium">@{param.username}</span>
        </p>
        <div className="flex flex-col gap-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Textarea
                      {...field}
                      name="message"
                      className="resize-none"
                      rows={3}
                      placeholder="Type your message here."
                    />
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <div className="relative w-full mt-8">
                <Button
                  type="submit"
                  className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Send It"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
