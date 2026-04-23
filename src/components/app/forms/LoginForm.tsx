import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await authService.login(data);

      navigate("/transactions");
      
    } catch (error) {
      // 3. Handle errors in Spanish for the UI
      if (
        error instanceof Error &&
        error.message.includes("Invalid login credentials")
      ) {
        setError("root", {
          type: "manual",
          message: "El correo electrónico o la contraseña son incorrectos.",
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Ocurrió un error inesperado al iniciar sesión.",
        });
      }
    }
  };

  // 4. UI RENDERING: Spanish text and native spread of register()
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm mx-auto"
    >
      <FormInput
        label="Correo Electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <FormInput
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />

      {errors.root && (
        <div className="text-sm font-medium text-red-500">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Iniciando sesión..." : "Entrar"}
      </Button>
    </form>
  );
}
