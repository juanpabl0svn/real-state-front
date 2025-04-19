"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Property, PropertyStatus } from "@/types";

import { propertySchema, PropertyFormSchema } from "@/lib/zod";
// import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

import { createProperty } from "@/lib/actions";
import useNumber from "@/hooks/use-number";
import { useState } from "react";
import ImageUploader from "./image-uploader";

export function PropertyForm({ property }: { property?: Property | null }) {
  // const { data: session } = useSession();

  const [mainImage, setMainImage] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  useNumber();

  const form = useForm<PropertyFormSchema>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          ...property,
          status: property?.status ?? ("available" as PropertyStatus),
          // Ensure numeric values are properly converted
          price: property.price,
          area: property.area,
          description: property.description ?? "",
          property_type: property.property_type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          parking_spaces: property.parking_spaces ?? 0,
        }
      : {
          title: "",
          description: "",
          price: 0,
          location: "",
          area: 0,
          bedrooms: 0,
          bathrooms: 0,
          parking_spaces: 0,
          status: "available" as PropertyStatus,
        },
  });

  const upsertProperty = async (propertyData: Partial<Property>) => {
    const formData = Object.fromEntries(
      Object.entries(propertyData).filter(([_, value]) => value !== undefined)
    ) as {
      title: string;
      description?: string;
      price: number;
      location: string;
      area: number;
      bedrooms: number;
      bathrooms: number;
      parking_spaces?: number;
      property_type: string;
      status?: string;
    };

    return createProperty(formData);
  };

  // const upsertProperty = async (propertyData: Partial<Property>) => {
  //   const { data } = await axios.post(`/api/properties/upsert`, propertyData);
  //   return data;
  // };

  const { mutate: executeUpsert, isPending } = useMutation({
    mutationFn: upsertProperty,
    onSuccess: () => {
      // form.reset(data);
      window.location.reload();
    },
    onError: (error) => {
      console.error("Error upserting property:", error);
    },
  });

  const handleFormSubmit = (values: PropertyFormSchema) => {
    const propertyData: Partial<Property> = {
      ...values,
      price: values.price,
      area: values.area,
    };
    executeUpsert(propertyData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Imagen principal</label>
            <ImageUploader
              files={mainImage}
              setFiles={setMainImage}
              multiple={false}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Galería de imágenes
            </label>
            <ImageUploader
              files={galleryImages}
              setFiles={setGalleryImages}
              multiple
            />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Property title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <FormControl>
                      <Input placeholder="Property location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (m²)*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms*</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms*</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parking_spaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parking Spaces</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the property..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/properties">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => form.trigger()}
              >
                {isPending
                  ? "Saving..."
                  : property
                  ? "Update Property"
                  : "Create Property"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
