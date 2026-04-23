import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm() {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    if (!user?.email) return;

    try {
      await authService.login({
        email: user.email,
        password: data.oldPassword,
      });

      await authService.updatePassword(data.password);
      reset(); // Clear the form on success
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message:
          "Hubo un error al actualizar la contraseña. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <FormInput
        label="Contraseña Actual"
        type="password"
        placeholder="********"
        error={errors.oldPassword?.message}
        {...register("oldPassword")}
      />

      <FormInput
        label="Nueva Contraseña"
        type="password"
        placeholder="********"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormInput
        label="Confirmar Contraseña"
        type="password"
        placeholder="********"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {errors.root && (
        <div className="text-sm font-medium text-red-500">
          {errors.root.message}
        </div>
      )}
      {isSubmitSuccessful && !errors.root && !errors.oldPassword && (
        <div className="text-sm font-medium text-green-500">
          ¡Contraseña actualizada con éxito!
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        {isSubmitting ? "Guardando..." : "Actualizar contraseña"}
      </Button>
    </form>
  );
}
