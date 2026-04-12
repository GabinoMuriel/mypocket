import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./form-input.tsx"; // The component from previous step
import { z } from "zod";

const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

export const signupSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 letras"),
    apellidos: z.string().min(3, "Los apellidos deben tener al menos 3 letras"),
    email: z.string().email("Email no válido"),
    password: z
        .string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe tener una mayúscula")
        .regex(/[a-z]/, "Debe tener una minúscula")
        .regex(/[^A-Za-z0-9]/, "Debe tener un símbolo"),
    confirmPassword: z.string(),
    dni: z.string().regex(dniRegex, "DNI no válido (8 números y letra)"),
    telefono: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9]{9}$/.test(val), "Deben ser 9 números"),
    fechaNacimiento: z.string().min(1, "La fecha es obligatoria"),
    direccion: z.string().optional(),
    municipio: z.string().optional(),
    cp: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9]{5}$/.test(val), "Deben ser 5 números"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export default function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data: any) => {
        console.log("Form Data:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
                label="Nombre"
                placeholder="Juan"
                {...register("nombre")}
                error={errors.nombre?.message}
            />

            <FormInput
                label="Apellidos"
                placeholder="Pérez García"
                {...register("apellidos")}
                error={errors.apellidos?.message}
            />

            <FormInput
                label="Email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register("email")}
                error={errors.email?.message}
            />

            <FormInput
                label="DNI"
                placeholder="12345678Z"
                {...register("dni")}
                error={errors.dni?.message}
            />

            <FormInput
                label="Contraseña"
                type="password"
                {...register("password")}
                error={errors.password?.message}
            />

            <FormInput
                label="Repetir Contraseña"
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
            />

            <FormInput
                label="Teléfono (Opcional)"
                placeholder="600000000"
                {...register("telefono")}
                error={errors.telefono?.message}
            />

            <FormInput
                label="Fecha de Nacimiento"
                type="date"
                {...register("fechaNacimiento")}
                error={errors.fechaNacimiento?.message}
            />

            <FormInput
                label="Dirección (Opcional)"
                {...register("direccion")}
            />

            <FormInput
                label="Municipio (Opcional)"
                {...register("municipio")}
            />

            <FormInput
                label="Código Postal (Opcional)"
                placeholder="28001"
                {...register("cp")}
                error={errors.cp?.message}
            />

            <div className="col-span-full mt-6">
                <button
                    type="submit"
                    className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                    Crear Cuenta
                </button>
            </div>
        </form>
    );
}