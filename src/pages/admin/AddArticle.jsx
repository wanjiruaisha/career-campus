import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { articleSchema } from "@/validation/articleSchema";
import { storage } from "@/firebase/firebase";
import { addArticle } from "@/services/articleService";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Technology",
  "Medicine",
  "Engineering",
  "Business",
  "Law",
  "Creative Arts",
  "Education",
  "Agriculture",
  "Finance",
  "Hospitality",
];

export default function AddArticle() {
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(articleSchema),

    defaultValues: {
      title: "",
      category: "",
      summary: "",
      content: "",
      status: "Published",
      thumbnail: null,
    },
  });

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  function handleThumbnailChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      toast.error("The thumbnail must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setThumbnail(file);
    setThumbnailPreview(previewUrl);

    setValue("thumbnail", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  async function onSubmit(values) {
    if (!thumbnail) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    setLoading(true);

    try {
      const safeFileName = thumbnail.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "");

      const uniqueFileName = `${Date.now()}-${safeFileName}`;

      const thumbnailReference = ref(
        storage,
        `article-thumbnails/${uniqueFileName}`
      );

      await uploadBytes(thumbnailReference, thumbnail);

      const thumbnailUrl = await getDownloadURL(
        thumbnailReference
      );

      const articleData = {
        title: values.title.trim(),
        category: values.category,
        summary: values.summary.trim(),
        content: values.content.trim(),
        status: values.status,
        thumbnail: thumbnailUrl,
      };

      await addArticle(articleData);

      toast.success("Article published successfully.");

      reset();
      setThumbnail(null);

      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      setThumbnailPreview("");

      navigate("/admin/articles");
    } catch (error) {
      console.error("Failed to publish article:", error);

      toast.error(
        error?.message ||
          "Failed to publish the article. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Create New Article
          </CardTitle>

          <CardDescription>
            Publish a new career article for Career Compass users.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Article title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium"
              >
                Article Title
              </label>

              <Input
                id="title"
                type="text"
                placeholder="e.g. How to Become a Data Scientist"
                disabled={loading}
                aria-invalid={Boolean(errors.title)}
                {...register("title")}
              />

              {errors.title && (
                <p className="text-sm font-medium text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger
                      aria-invalid={Boolean(errors.category)}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.category && (
                <p className="text-sm font-medium text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label
                htmlFor="summary"
                className="text-sm font-medium"
              >
                Summary
              </label>

              <Textarea
                id="summary"
                rows={4}
                placeholder="Write a short summary of the article..."
                disabled={loading}
                aria-invalid={Boolean(errors.summary)}
                {...register("summary")}
              />

              {errors.summary && (
                <p className="text-sm font-medium text-destructive">
                  {errors.summary.message}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-3">
              <label
                htmlFor="thumbnail"
                className="text-sm font-medium"
              >
                Thumbnail Image
              </label>

              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                disabled={loading}
                onChange={handleThumbnailChange}
              />

              <p className="text-sm text-muted-foreground">
                Select a JPG, PNG, WEBP, or another image smaller
                than 5 MB.
              </p>

              {errors.thumbnail && (
                <p className="text-sm font-medium text-destructive">
                  {errors.thumbnail.message}
                </p>
              )}

              {thumbnailPreview && (
                <div className="max-w-sm overflow-hidden rounded-lg border">
                  <img
                    src={thumbnailPreview}
                    alt="Selected article thumbnail preview"
                    className="h-52 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Article content */}
            <div className="space-y-2">
              <label
                htmlFor="content"
                className="text-sm font-medium"
              >
                Article Content
              </label>

              <Textarea
                id="content"
                rows={12}
                placeholder="Write the full article here..."
                disabled={loading}
                aria-invalid={Boolean(errors.content)}
                {...register("content")}
              />

              {errors.content && (
                <p className="text-sm font-medium text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status
              </label>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger
                      aria-invalid={Boolean(errors.status)}
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Published">
                        Published
                      </SelectItem>

                      <SelectItem value="Draft">
                        Draft
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.status && (
                <p className="text-sm font-medium text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Article"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}