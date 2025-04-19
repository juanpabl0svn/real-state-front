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
import type { Property, ReturnTypeHandler } from "@/types";

import { propertySchema, PropertyFormSchema } from "@/lib/zod";
// import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

import { createProperty } from "@/lib/actions";
import useNumber from "@/hooks/use-number";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import ImageUploader from "../image-uploader";

export function PropertyForm({
  property,
  handleSubmit,
}: {
  property?: Omit<Property, "status"> | null;
  handleSubmit: (property: Property) => Promise<ReturnTypeHandler>;
}) {
  const [mainPhoto, setMainPhoto] = useState<(File | string)[]>([]);
  const [photos, setPhotos] = useState<(File | string)[]>([]);

  useNumber();

  const form = useForm<PropertyFormSchema>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          ...property,
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
        },
  });

  const handleFormSubmit = (values: PropertyFormSchema) => {
    const propertyData: Partial<Property> = {
      ...values,
    };

    if (mainPhoto.length == 0) {
      toast({
        title: "Error",
        description: "Please upload a main photo.",
        variant: "destructive",
      });
      return;
    }
    // return createProperty({
    //   ...formData,
    //   mainPhoto: mainPhoto as Array<File>,
    //   photos: photos as Array<File>,
    // });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Imagen principal</label>
            <ImageUploader
              files={mainPhoto}
              setFiles={setMainPhoto}
              multiple={false}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Galería de imágenes
            </label>
            <ImageUploader files={photos} setFiles={setPhotos} multiple />
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
              {/* <Button
                type="submit"
                disabled={isPending}
                onClick={() => form.trigger()}
              >
                {isPending
                  ? "Saving..."
                  : property
                  ? "Update Property"
                  : "Create Property"}
              </Button> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
