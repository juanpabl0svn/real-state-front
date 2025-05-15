"use client";

import { Link } from "@/i18n/navigation";
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
import type { IPropertyForm, Property, ReturnTypeHandler } from "@/types";

import { propertySchema, PropertyFormSchema } from "@/lib/zod";

import useNumber from "@/hooks/use-number";
import { useEffect, useState, useMemo } from "react";
import ImageUploader from "./image-uploader";
import { useAppStore } from "@/stores/app-store";

import { toast } from "react-hot-toast";

import { getPhotosFromPropertyId } from "@/lib/actions";

import { CityCombobox } from "@/components/city-combobox";
import { NeighborhoodCombobox } from "@/components/neighborhood-combobox";
import { useLocations } from "@/hooks/use-locations";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

export function PropertyForm({
  property,
  handleSubmit,
}: {
  property?: Omit<Property, "status"> | null;
  handleSubmit: (property: IPropertyForm) => Promise<ReturnTypeHandler>;
}) {
  const [mainPhoto, setMainPhoto] = useState<(File | string)[]>(
    [property?.main_photo!].filter(Boolean) as Array<File | string>
  );
  const [photos, setPhotos] = useState<(File | string)[]>([]);
  const { isLoading, setIsLoading } = useAppStore();

  const { cities, getNeighborhoods } = useLocations();

  const t = useTranslations();

  useNumber();

  useEffect(() => {
    (async () => {
      if (property) {
        const photosObtained = await getPhotosFromPropertyId(property.id);
        setPhotos(photosObtained);
      }
    })();
  }, [property]);

  const form = useForm<PropertyFormSchema>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          ...property,
          price: Number(property.price),
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
          city: "",
          neighborhood: "",
          area: 0,
          bedrooms: 0,
          bathrooms: 0,
          parking_spaces: 0,
        },
  });

  const cityValue = useWatch({
    control: form.control,
    name: "city",
  });
  const currentNeighborhoods = useMemo(
    () => getNeighborhoods(cityValue),
    [cityValue, getNeighborhoods]
  );

  const handleFormSubmit = async (values: PropertyFormSchema) => {
    setIsLoading(true);
    try {
      const validatedFields = propertySchema.safeParse(values);
      if (!validatedFields.success) {
        throw new Error(t("form.validation_error"));
      }

      const data = {
        ...validatedFields.data,
        main_photo: mainPhoto as Array<File>,
        photos: photos as Array<File>,
      };

      const result = await handleSubmit(data as unknown as IPropertyForm);

      if (result?.error) {
        throw new Error(result.message);
      }

      toast.success(
        property ? t("form.property_updated") : t("form.property_created")
      );
    } catch (e) {
      console.error("Form submission error:", e);
      toast.error(
        e instanceof Error
          ? e.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">{t('property.main_photo')}</label>
            <ImageUploader
              files={mainPhoto}
              setFiles={setMainPhoto}
              multiple={false}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              {t("property.gallery")}
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
                    <FormLabel>{t("property.title")}*</FormLabel>
                    <FormControl>
                      <Input placeholder={t("property.title")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("filter.city")}*</FormLabel>
                    <FormControl>
                      <CityCombobox
                        cities={cities}
                        value={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("filter.neighborhood")}*</FormLabel>
                    <FormControl>
                      <NeighborhoodCombobox
                        key={cityValue}
                        neighborhoods={currentNeighborhoods}
                        value={field.value}
                        onSelect={field.onChange}
                        disabled={!cityValue}
                      />
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
                    <FormLabel>{t("property.price")}*</FormLabel>
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
                    <FormLabel>{t("property.area")}(m²)*</FormLabel>
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
                    <FormLabel>{t("property.bedrooms")}*</FormLabel>
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
                    <FormLabel>{t("property.bathrooms")}*</FormLabel>
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
                    <FormLabel>{t("property.parking_spaces")}</FormLabel>
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
                    <FormLabel>{t("property.property_type")}*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('property.select_property_type')}/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">
                          {t("property.house")}
                        </SelectItem>
                        <SelectItem value="apartment">
                          {t("property.apartment")}
                        </SelectItem>
                        <SelectItem value="land">
                          {t("property.land")}
                        </SelectItem>
                        <SelectItem value="office">
                          {t("property.office")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {property && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("property.status")}*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('property.select_status')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">
                            {t("property.available")}
                          </SelectItem>
                          {/* <SelectItem value="reserved">
                            {t("property.reserved")}
                          </SelectItem> */}
                          <SelectItem value="sold">
                            {t("property.sold")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("property.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("property.describe_property")}
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
                <Link href="/admin/properties">{t('common.cancel')}</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                onClick={() => form.trigger()}
              >
                {isLoading
                  ? t('property.saving')
                  : property
                  ? t('property.updating')
                  : t('property.creating')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
