"use client";

import { useState } from "react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import toast from "react-hot-toast";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";
import ReactPlayer from "react-player";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface ChapterVideoProps {
  initialData: Chapter & {course: Course;};
  courseId: string;
  chapterId: string;
}

interface ThumbnailProps {
  data: {
    thumbnail: string;
  }
}


// Regex pattern for YouTube URL validation
const youtubeUrlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;

const formSchema = z.object({
  videoUrl: z.string().min(1).regex(youtubeUrlPattern, {
    message: "Invalid YouTube URL format",
  }),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const adjustedInitialData = {
    ...initialData,
    videoUrl: initialData.videoUrl ?? undefined,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: adjustedInitialData,
  });

  const { isSubmitting, isValid } = form.formState;


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!initialData.course.imageUrl && initialData.position === 1) {
        const response: ThumbnailProps = await axios.get(`/api/thumbnail`, {
          params: {
            videoURL: values.videoUrl
          }
        });

        const newImageUrl = {imageUrl: response.data.thumbnail}

        await axios.patch(`/api/courses/${courseId}`, newImageUrl);
      }

      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>
          Chapter Video<span className="text-red-500">*</span>
        </div>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 rounded-md overflow-hidden">
            <ReactPlayer
              url={initialData.videoUrl || ""}
              controls={true}
              width={"100%"}
              height={"100%"}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Url video"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process.Refresh the page if videos
          does not appear.
        </div>
      )}
    </div>
  );
};
