import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

// 1. SCHEMA: Now only requires email and password for the production flow
const signupSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });


  const onSubmit = async (data: SignupFormValues) => {
    try {
      await authService.signup(data);

      onSuccess();

    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          setError("root", {
            type: "manual",
            message: "Este correo electrónico ya está registrado."
          });
        } else {
          setError("root", {
            type: "manual",
            message: "Hubo un problema al crear la cuenta: " + error.message
          });
        }
      } else {
        setError("root", {
          type: "manual",
          message: "Ocurrió un error inesperado al registrarse."
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Correo electrónico"
        type="email"
        placeholder="ejemplo@correo.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        label="Contraseña"
        type="password"
        placeholder="********"
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Root Error Display */}
      {errors.root && (
        <div className="text-sm font-medium text-red-500">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creando cuenta..." : "Registrarse"}
      </Button>
    </form>
  );
}