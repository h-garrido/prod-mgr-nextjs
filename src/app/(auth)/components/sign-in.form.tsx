"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const SignInForm = () => {

  const [isLoading, setisLoading] = useState<boolean>(false);

  /* ======== Form Schema ======== */

  const formSchema = z.object({
    email: z
      .string()
      .email(
        "Formato de correo electrónico no válido. Ejemplo: usuario@correo.com"
      )
      .min(1, {
        message: "El correo electrónico es obligatorio",
      })
      .max(255),
    password: z.string().min(6, {
      message: "La contraseña debe tener como mínimo 6 caracteres",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  /* ======== Sign In ======== */
  const onSubmit = async (user: z.infer<typeof formSchema>) => {

    setisLoading(true);
    try {
      let res = await signIn(user);
    } catch (error: any) {
      toast.error(error.message, {duration: 3000});
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <div className="text-center font-sans">
        <h1 className="text-2xl font-semibold">Iniciar Sesión</h1>

        <p className="text-xs text-muted-foreground">
          Introduce tu correo electrónico y contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {/* ======== Email ======== */}
          <div className="mb-3">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
            <p className="form-error">{errors.email?.message}</p>
          </div>
          {/* ======== Password ======== */}
          <div className="mb-3">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="********"
            />
            <p className="form-error">{errors.password?.message}</p>
          </div>

          <Link
            href="/forgot-password"
            className="underline text-muted-foreground underline-offset-4 hover:text-primary mb-6 text-sm text-end"
          >
            ¿Olvidó su contraseña?
          </Link>

          {/* ======== Submit ======== */}
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
            )}
            Iniciar Sesión
            </Button>
        </div>
      </form>

      {/* ======== Sign Up ======== */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/sign-up"
          className="underline underline-offset-4 hover:text-primary"
        >
          Regístrate
        </Link>
      </p>
    </>
  );
};

export default SignInForm;
