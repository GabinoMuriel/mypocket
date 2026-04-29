import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import i18n from "@/locales/i18n";
import { useTranslation } from "react-i18next";

// 1. SCHEMA: Now only requires email and password for the production flow
const signupSchema = z
  .object({
    email: z.string().email(i18n.t("VALIDATION.AUTH.EMAIL_INVALID")),
    password: z
      .string()
      .min(8, i18n.t("VALIDATION.AUTH.PASSWORD_MIN"))
      .regex(/[A-Z]/, i18n.t("VALIDATION.AUTH.PASSWORD_UPPERCASE"))
      .regex(/[a-z]/, i18n.t("VALIDATION.AUTH.PASSWORD_LOWERCASE"))
      .regex(/[^A-Za-z0-9]/, i18n.t("VALIDATION.AUTH.PASSWORD_SPECIAL")),
    confirmPassword: z.string().min(1, i18n.t("VALIDATION.AUTH.CONFIRM_REQUIRED")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: i18n.t("VALIDATION.AUTH.PASSWORDS_DONT_MATCH"),
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { t } = useTranslation();

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

      onSuccess();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          setError("root", {
            type: "manual",
            message: t('AUTH_FORMS.SIGNUP.ERROR_ALREADY_REGISTERED'),
          });
        } else {
          setError("root", {
            type: "manual",
            message: t('AUTH_FORMS.SIGNUP.ERROR_CREATION_PROBLEM') + error.message,
          });
        }
      } else {
        setError("root", {
          type: "manual",
          message: t('AUTH_FORMS.SIGNUP.ERROR_UNEXPECTED'),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label={t('AUTH_FORMS.SIGNUP.EMAIL_LABEL')}
        type="email"
        placeholder={t('AUTH_FORMS.SIGNUP.EMAIL_PLACEHOLDER')}
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        label={t('AUTH_FORMS.SIGNUP.PASSWORD_LABEL')}
        type="password"
        placeholder={t('AUTH_FORMS.SIGNUP.PASSWORD_PLACEHOLDER')}
        error={errors.password?.message}
        {...register("password")}
      />

      <FormInput
        label={t('AUTH_FORMS.SIGNUP.CONFIRM_PASSWORD_LABEL')}
        type="password"
        placeholder={t('AUTH_FORMS.SIGNUP.CONFIRM_PASSWORD_PLACEHOLDER')}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Root Error Display */}
      {errors.root && (
        <div className="text-sm font-medium text-red-500">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('AUTH_FORMS.SIGNUP.SUBMITTING') : t('AUTH_FORMS.SIGNUP.SUBMIT')}
      </Button>
    </form>
  );
}
