import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/types/profile.schema";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";

export default function BasicInfoForm() {
    const profile = useAuthStore((state) => state.profile);
    const user = useAuthStore((state) => state.user);
    const setProfile = useAuthStore((state) => state.setProfile);
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            first_name: profile?.first_name || "",
            last_name: profile?.last_name || "",
            birthdate: profile?.birthdate || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            city: profile?.city || "",
            postal_code: profile?.postal_code || "",
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user) return;

        if (!isDirty) {
            setError("root", {
                type: "manual",
                message: t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.NO_CHANGES')
            });
            return;
        }

        const cleanedData = {
            first_name: data.first_name?.trim() || null,
            last_name: data.last_name?.trim() || null,
            phone: data.phone?.trim() || null,
            address: data.address?.trim() || null,
            city: data.city?.trim() || null,
            postal_code: data.postal_code?.trim() || null,
            birthdate: data.birthdate?.trim() || null,
        };

        try {
            const updatedProfile = await authService.updateProfile(user.id, cleanedData);

            setProfile(updatedProfile);

            reset({
                first_name: updatedProfile.first_name || "",
                last_name: updatedProfile.last_name || "",
                phone: updatedProfile.phone || "",
                address: updatedProfile.address || "",
                city: updatedProfile.city || "",
                postal_code: updatedProfile.postal_code || "",
                birthdate: updatedProfile.birthdate || "",
            });

        } catch (error) {
            console.error(error);
            setError("root", {
                type: "manual",
                message: t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.ERROR')
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.FIRST_NAME')} type="text" error={errors.first_name?.message} {...register("first_name")} />
                <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.LAST_NAME')} type="text" error={errors.last_name?.message} {...register("last_name")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.PHONE')} type="text" error={errors.phone?.message} {...register("phone")} />
                <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.BIRTHDATE')} type="date" error={errors.birthdate?.message} {...register("birthdate")} />
            </div>

            <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.ADDRESS')} type="text" error={errors.address?.message} {...register("address")} />

            <div className="grid grid-cols-2 gap-4">
                <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.CITY')} type="text" error={errors.city?.message} {...register("city")} />
                <FormInput label={t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.POSTAL_CODE')} type="text" error={errors.postal_code?.message} {...register("postal_code")} />
            </div>

            {errors.root && <div className="text-sm font-medium text-red-500">{errors.root.message}</div>}
            {isSubmitSuccessful && !errors.root && !isDirty && <div className="text-sm font-medium text-green-500">{t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.SUCCESS')}</div>}

            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                {isSubmitting ? t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.SAVING') : t('EDIT_PROFILE_PAGE.BASIC_INFO_FORM.SAVE_CHANGES')}
            </Button>
        </form>
    );
}