import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

// 1. SCHEMA: Keys in English, Messages in Spanish
export const loginSchema = z.object({
    email: z.string().email("Introduce un email válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

// 2. TYPE INFERENCE
export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    // 3. STRICTLY TYPED HOOK
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            // 1. Call the service layer
            await authService.login(data.email, data.password);

            // 2. Success! (If this is inside your AuthModal, you will want to close the modal here)
            console.log("Login exitoso");

        } catch (error: any) {
            // 3. Handle errors in Spanish for the UI
            console.error(error);
            // You can use react-hook-form's setError to display the message
            // Or simply use a local state variable to show a general error alert
            alert("Error al iniciar sesión: Verifica tu email y contraseña.");
        }
    };

    // 4. UI RENDERING: Spanish text and native spread of register()
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm mx-auto">

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

            <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Entrar"}
            </Button>

        </form>
    );
}