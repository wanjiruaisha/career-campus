import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "sonner";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { articleSchema } from "@/validation/articleSchema";
import { storage } from "@/firebase/firebase";

import {
  getArticleById,
  updateArticle,
} from "@/services/articleService";

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

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newThumbnail, setNewThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] =
    useState("");
  const [thumbnailPreview, setThumbnailPreview] =
    useState("");

  const {
    register,
    handleSubmit,
    control,
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

  // Load the article from Firestore
  useEffect(() => {
    async function loadArticle() {
      try {
        setPageLoading(true);

        const article = await getArticleById(id);

        if (!article) {
          toast.error("Article not found.");
          navigate("/admin/articles");
          return;
        }

        reset({
          title: article.title || "",
          category: article.category || "",
          summary: article.summary || "",
          content: article.content || "",
          status: article.status || "Published",
          thumbnail: null,
        });

        setExistingThumbnail(article.thumbnail || "");
        setThumbnailPreview(article.thumbnail || "");
      } catch (error) {
        console.error("Failed to load article:", error);

        toast.error(
          error?.message ||
            "Failed to load the article."
        );
      } finally {
        setPageLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id, navigate, reset]);

  // Clean up locally generated image previews
  useEffect(() => {
    return () => {
      if (thumbnailPreview.startsWith("blob:")) {
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
      toast.error(
        "The thumbnail must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setNewThumbnail(file);
    setThumbnailPreview(previewUrl);
  }

  async function onSubmit(values) {
    setSaving(true);

    try {
      let thumbnailUrl = existingThumbnail;

      // Upload a new image only when the admin selects one
      if (newThumbnail) {
        const safeFileName = newThumbnail.name
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9._-]/g, "");

        const uniqueFileName =
          `${Date.now()}-${safeFileName}`;

        const thumbnailReference = ref(
          storage,
          `article-thumbnails/${uniqueFileName}`
        );

        await uploadBytes(
          thumbnailReference,
          newThumbnail
        );

        thumbnailUrl = await getDownloadURL(
          thumbnailReference
        );
      }

      if (!thumbnailUrl) {
        toast.error(
          "Please select a thumbnail image."
        );

        return;
      }

      const updatedArticle = {
        title: values.title.trim(),
        category: values.category,
        summary: values.summary.trim(),
        content: values.content.trim(),
        status: values.status,
        thumbnail: thumbnailUrl,
      };

      await updateArticle(id, updatedArticle);

      toast.success("Article updated successfully.");

      navigate("/admin/articles");
    } catch (error) {
      console.error("Failed to update article:", error);

      toast.error(
        error?.message ||
          "Failed to update the article. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Loading article...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="mb-4">
            <Button
              type="button"
              variant="ghost"
              className="px-0"
              onClick={() =>
                navigate("/admin/articles")
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />

              Back to Articles
            </Button>
          </div>

          <CardTitle className="text-3xl font-bold">
            Edit Article
          </CardTitle>

          <CardDescription>
            Update the article information and save your
            changes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Title */}
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
                disabled={saving}
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
                    disabled={saving}
                  >
                    <SelectTrigger
                      aria-invalid={Boolean(
                        errors.category
                      )}
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
                placeholder="Write a short summary..."
                disabled={saving}
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
                disabled={saving}
                onChange={handleThumbnailChange}
              />

              <p className="text-sm text-muted-foreground">
                Leave this empty to keep the current
                thumbnail.
              </p>

              {thumbnailPreview && (
                <div className="max-w-sm overflow-hidden rounded-lg border">
                  <img
                    src={thumbnailPreview}
                    alt="Article thumbnail preview"
                    className="h-52 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Content */}
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
                placeholder="Write the full article..."
                disabled={saving}
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
                    disabled={saving}
                  >
                    <SelectTrigger
                      aria-invalid={Boolean(
                        errors.status
                      )}
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

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() =>
                  navigate("/admin/articles")
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}