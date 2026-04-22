import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

// Local schema because this is single-use
const passwordSchema = z.object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm() {
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
        try {
            await authService.updatePassword(data.password);
            reset(); // Clear the form on success
        } catch (error) {
            console.error(error);
            setError("root", {
                type: "manual",
                message: "Hubo un error al actualizar la contraseña. Inténtalo de nuevo."
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
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

            {errors.root && <div className="text-sm font-medium text-red-500">{errors.root.message}</div>}
            {isSubmitSuccessful && !errors.root && (
                <div className="text-sm font-medium text-green-500">¡Contraseña actualizada con éxito!</div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Guardando..." : "Actualizar contraseña"}
            </Button>
        </form>
    );
}