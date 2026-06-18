"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ArtworkForm({ onSuccess, initialData }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialData || {},
  });

  // এডিট মোড হলে ফর্ম রিসেট করবে
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    let imageUrl = data.imageUrl;

    // যদি নতুন ইমেজ আপলোড করা হয়
    if (data.image && data.image.length > 0) {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await res.json();
      if (result.success) imageUrl = result.data.display_url;
    }

    const artworkData = { ...data, price: parseFloat(data.price), imageUrl };
    onSuccess?.(artworkData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input {...register("title", { required: true })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea {...register("description", { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input type="number" {...register("price", { required: true })} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="digital">Digital Art</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Upload Image</Label>
        <Input type="file" {...register("image")} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Artwork"}
      </Button>
    </form>
  );
}
