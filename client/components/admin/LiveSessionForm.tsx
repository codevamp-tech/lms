"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LiveSessionData } from "@/features/api/live-session";
import useLiveSessions from "@/hooks/useLiveSessions";
import { axiosInstance } from "@/lib/axios";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
});

interface LiveSessionFormProps {
  session?: LiveSessionData;
  onFinished?: () => void;
}

const LiveSessionForm: React.FC<LiveSessionFormProps> = ({ session, onFinished }) => {
  const { createLiveSession, updateLiveSession } = useLiveSessions();
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      instructor: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session) {
      reset({
        title: session.title,
        description: session.description,
        date: new Date(session.date).toISOString().slice(0, 16),
        duration: session.duration?.toString(),
        price: session.price?.toString(),
      });
      if ((session as any).imageUrl) {
        setPreviewUrl((session as any).imageUrl);
      }
    }
  }, [session, reset]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    (async () => {
      let imageUrl: string | undefined = undefined;
      if (selectedFile) {
        try {
          setUploading(true);
          const formData = new FormData();
          formData.append("file", selectedFile);
          const resp = await axiosInstance.post("/live-session/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageUrl = resp.data.url;
        } catch (err) {
          alert("Image upload failed. Please try again.");
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      if (session) {
        const updatedData: any = {
          ...values,
          date: new Date(values.date),
          duration: parseInt(values.duration),
          price: parseInt(values.price),
        };
        if (imageUrl) updatedData.imageUrl = imageUrl;
        updateLiveSession({ sessionId: session._id!, updatedData });
      } else {
        const companyId = localStorage.getItem("companyId");
        const instructorId = localStorage.getItem("userId");
        if (!companyId || !instructorId) {
          alert("Company ID or Instructor ID not found. Please log in again.");
          return;
        }
        const sessionData: any = {
          ...values,
          date: new Date(values.date),
          duration: parseInt(values.duration),
          price: parseInt(values.price),
          companyId,
          instructor: instructorId,
        };
        if (imageUrl) sessionData.imageUrl = imageUrl;
        createLiveSession(sessionData);
      }
      setIsOpen(false);
      if (onFinished) onFinished();
    })();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{session ? "Edit Session" : "Create New Session"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{session ? "Edit Live Session" : "Create a New Live Session"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Title</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label>Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>
          <div>
            <label>Date and Time</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => <Input type="datetime-local" {...field} />}
            />
            {errors.date && <p className="text-red-500">{errors.date.message}</p>}
          </div>
          <div>
            <label>Duration (in minutes)</label>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            {errors.duration && <p className="text-red-500">{errors.duration.message}</p>}
          </div>
          <div>
            <label>Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>
          <div>
            <label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="h-32 mt-2 object-cover" />
            )}
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : session ? "Update Session" : "Create Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LiveSessionForm;
