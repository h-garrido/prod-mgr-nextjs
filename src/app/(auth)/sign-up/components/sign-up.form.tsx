"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, setDocument, updateUser } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interface";

const SignUpForm = () => {
  

  const [isLoading, setisLoading] = useState<boolean>(false);

  /* ======== Form Schema ======== */

  const formSchema = z
    .object({
      uid: z.string(),
      name: z.string().min(3, {
        message: "El nombre debe contener al menos 3 caracteres",
      }),
      lastname: z.string().min(2, {
        message: "El apellido debe contener al menos 2 caracteres",
      }),
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
      confirmPassword: z.string().min(6, {
        message:
          "La confirmación de la contraseña debe tener como mínimo 6 caracteres",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  /* ======== Sign In ======== */
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    console.log(user);
    setisLoading(true);
    try {
      let res = await createUser(user);
      await updateUser({ displayName: user.name });
      user.uid = res.user.uid;

      await createUserInDB(user as User);
    } catch (error: any) {
      toast.error(error.message, { duration: 3000 });
    } finally {
      setisLoading(false);
    }
  };

  /* ======== Create user in Firebase Database ======== */
  const createUserInDB = async (user: User) => {
    const path = `users/${user.uid}`;
    setisLoading(true);

    try {
      delete user.password;
      await setDocument(path, user);

      toast(`Bienvenido, ${user.name}`, { icon: "👋​" });
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <div className="text-center font-sans">
        <h1 className="text-2xl font-semibold">Registro</h1>

        <p className="text-xs text-muted-foreground">
          Ingresa tu información personal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {/* ======== Name ======== */}
          <div className="mb-3">
            <Label htmlFor="name">Nombres</Label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Johnny"
              autoComplete="name"
            />
            <p className="form-error">{errors.name?.message}</p>
          </div>
          {/* ======== Lastname ======== */}
          <div className="mb-3">
            <Label htmlFor="lastname">Apellidos</Label>
            <Input
              {...register("lastname")}
              id="lastname"
              type="text"
              placeholder="Walker"
              autoComplete="lastname"
            />
            <p className="form-error">{errors.lastname?.message}</p>
          </div>
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
          {/* ======== Confirm Password ======== */}
          <div className="mb-3">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="********"
            />
            <p className="form-error">{errors.confirmPassword?.message}</p>
          </div>

          {/* ======== Submit ======== */}
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Registrarse
          </Button>
        </div>
      </form>

      {/* ======== Sign Up ======== */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Ingresa aquí
        </Link>
      </p>
    </>
  );
};

export default SignUpForm;
