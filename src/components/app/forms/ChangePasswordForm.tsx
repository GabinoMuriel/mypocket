import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import i18n from "@/locales/i18n";
import { useTranslation } from "react-i18next";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, i18n.t("VALIDATION.AUTH.OLD_PASSWORD_REQUIRED")),
    password: z
      .string()
      .min(8, i18n.t("VALIDATION.AUTH.PASSWORD_MIN"))
      .regex(/[A-Z]/, i18n.t("VALIDATION.AUTH.PASSWORD_UPPERCASE"))
      .regex(/[a-z]/, i18n.t("VALIDATION.AUTH.PASSWORD_LOWERCASE"))
      .regex(/[^A-Za-z0-9]/, i18n.t("VALIDATION.AUTH.PASSWORD_SPECIAL")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.t("VALIDATION.AUTH.PASSWORDS_DONT_MATCH"),
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: i18n.t("VALIDATION.AUTH.NEW_PASSWORD_DIFFERENT"),
    path: ["password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm() {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

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
        message: t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.ERROR_UPDATE'),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <FormInput
        label={t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.OLD_PASSWORD_LABEL')}
        type="password"
        placeholder={t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.OLD_PASSWORD_PLACEHOLDER')}
        error={errors.oldPassword?.message}
        {...register("oldPassword")}
      />

      <FormInput
        label={t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.NEW_PASSWORD_LABEL')}
        type="password"
        placeholder={t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.NEW_PASSWORD_PLACEHOLDER')}
        error={errors.password?.message}
        {...register("password")}
      />
      <FormInput
        label={t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.CONFIRM_PASSWORD_LABEL')}
        type="password"
        placeholder={t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.CONFIRM_PASSWORD_PLACEHOLDER')}
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
          {t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.SUCCESS')}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        {isSubmitting ? t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.SUBMITTING') : t('EDIT_PROFILE_PAGE.CHANGE_PASSWORD_FORM.SUBMIT')}
      </Button>
    </form>
  );
}
