import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Introduce un email válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

// This helps TypeScript know the shape of your data
type LoginFormValues = z.infer<typeof loginSchema>;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./form-input";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        // Simulate an API call
        console.log("Iniciando sesión con:", data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm space-y-6 p-6 border rounded-xl shadow-sm bg-card"
            >


                <div className="space-y-4">
                    <CustomInput
                        label="Email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <div className="relative">
                        <CustomInput
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                        <div className="flex justify-end mt-1">
                            <a
                                href="/forgot-password"
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "Cargando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}