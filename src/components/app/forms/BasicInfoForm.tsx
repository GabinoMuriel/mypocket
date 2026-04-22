import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/types/profile.schema";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export default function BasicInfoForm() {
    const profile = useAuthStore((state) => state.profile);
    const user = useAuthStore((state) => state.user);
    const setProfile = useAuthStore((state) => state.setProfile);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            birthdate: profile?.birthdate || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            city: profile?.city || "",
            postalCode: profile?.postal_code || "",
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user) return;

        if (!isDirty) {
            setError("root", {
                type: "manual",
                message: "No se han realizado cambios."
            });
            return;
        }

        const cleanedData = {
            first_name: data.firstName?.trim() || null,
            last_name: data.lastName?.trim() || null,
            phone: data.phone?.trim() || null,
            address: data.address?.trim() || null,
            city: data.city?.trim() || null,
            postal_code: data.postalCode?.trim() || null,
            birthdate: data.birthdate?.trim() || null,
        };

        try {
            const updatedProfile = await authService.updateProfile(user.id, data);

            setProfile(updatedProfile);

            reset({
                firstName: updatedProfile.first_name || "",
                lastName: updatedProfile.last_name || "",
                phone: updatedProfile.phone || "",
                address: updatedProfile.address || "",
                city: updatedProfile.city || "",
                postalCode: updatedProfile.postal_code || "",
                birthdate: updatedProfile.birthdate || "",
            });

        } catch (error) {
            console.error(error);
            setError("root", {
                type: "manual",
                message: "Error al actualizar el perfil. Inténtalo de nuevo."
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Nombre" type="text" error={errors.firstName?.message} {...register("firstName")} />
                <FormInput label="Apellido" type="text" error={errors.lastName?.message} {...register("lastName")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Teléfono" type="text" error={errors.phone?.message} {...register("phone")} />
                <FormInput label="Fecha de nacimiento" type="date" error={errors.birthdate?.message} {...register("birthdate")} />
            </div>

            <FormInput label="Dirección" type="text" error={errors.address?.message} {...register("address")} />

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Ciudad" type="text" error={errors.city?.message} {...register("city")} />
                <FormInput label="Código Postal" type="text" error={errors.postalCode?.message} {...register("postalCode")} />
            </div>

            {errors.root && <div className="text-sm font-medium text-red-500">{errors.root.message}</div>}
            {isSubmitSuccessful && !errors.root && !isDirty && <div className="text-sm font-medium text-green-500">¡Perfil actualizado con éxito!</div>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
        </form>
    );
}