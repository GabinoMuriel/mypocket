import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

const signupSchema = z
  .object({
    firstName: z.string().min(3, "El nombre debe tener al menos 3 letras"),
    lastName: z.string().min(3, "Los apellidos deben tener al menos 3 letras"),
    email: z.string().email("Email no válido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe tener una mayúscula")
      .regex(/[a-z]/, "Debe tener una minúscula")
      .regex(/[^A-Za-z0-9]/, "Debe tener un símbolo"),
    confirmPassword: z.string(),
    // Handled as string to preserve potential leading zeros or formatting [1]
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{9}$/.test(val), "Deben ser 9 números"),

    birthdate: z.string().min(1, "La fecha es obligatoria"),
    address: z.string().optional(),
    city: z.string().optional(),
    // Handled as string to preserve leading zeros [2]
    postalCode: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{5}$/.test(val), "Deben ser 5 números"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const navigate = useNavigate();

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
      navigate("/transactions");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          setError("root", {
            type: "manual",
            message: "Este correo electrónico ya está registrado.",
          });
        } else {
          setError("root", {
            type: "manual",
            message: "Hubo un problema al crear la cuenta: " + error.message,
          });
        }
      } else {
        setError("root", {
          type: "manual",
          message: "Ocurrió un error inesperado al registrarse.",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md mx-auto"
    >
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          placeholder="Tu nombre"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <FormInput
          label="Apellidos"
          placeholder="Tus apellidos"
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <FormInput
        label="Correo Electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <FormInput
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* We use type="tel" for better mobile keyboards, but it still outputs a string */}
        <FormInput
          label="Teléfono (Opcional)"
          type="tel"
          placeholder="600123456"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <FormInput
          label="Fecha de Nacimiento"
          type="date"
          {...register("birthdate")}
          error={errors.birthdate?.message}
        />
      </div>

      <FormInput
        label="Dirección (Opcional)"
        placeholder="Calle Mayor 1"
        {...register("address")}
        error={errors.address?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Municipio (Opcional)"
          placeholder="Madrid"
          {...register("city")}
          error={errors.city?.message}
        />
        {/* We use type="text" but inputMode="numeric" to pull up the number pad on mobile while keeping it a string */}
        <FormInput
          label="Código Postal (Opcional)"
          type="text"
          inputMode="numeric"
          placeholder="28001"
          {...register("postalCode")}
          error={errors.postalCode?.message}
        />
      </div>

      {errors.root && (
        <div className="text-sm font-medium text-red-500">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Creando cuenta..." : "Registrarse"}
      </Button>
    </form>
  );
}
