"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { User, Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import ImageUploaderProfile from "./image-uploader-profile";
import { updateProfile } from "@/lib/actions";
import usePhone from "@/hooks/use-phone";

import { profileFormSchema, ProfileFormValues } from "@/lib/zod";

export function ProfileForm() {
  const session = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState<Array<File | string>>([]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  usePhone();

  useEffect(() => {
    if (session?.data?.user) {
      form.reset({
        name: session.data.user.name,
        phone: session.data.user.phone ?? "",
      });
      setImage([session.data.user.image || ""]);
    }
  }, [session?.data?.user]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      console.log({data})
      const res = await updateProfile({ ...data, image: image[0] });

      console.log({res})

      if (res.error) {
        throw new Error(res.message);
      }

      await session.update({
        user: {
          ...session.data?.user,
          ...res.data,
        },
      });

      console.log("Perfil actualizado:", res.data, session.data?.user);
      toast.success("Perfil actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast.error(
        "Hubo un error al actualizar tu perfil. Por favor intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 flex justify-between ">
      <div className="flex flex-col gap-6 ">
        <ImageUploaderProfile files={image} setFiles={setImage} />
        <p className="text-muted-foreground text-xs">
          Da click en la imagen o suelta una imagen para cambiarla
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10 w-full"
                        placeholder="Tu nombre"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10 w-full"
                        type="tel"
                        aria-label="phone"
                        placeholder="3001231234"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="inline-block">
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
