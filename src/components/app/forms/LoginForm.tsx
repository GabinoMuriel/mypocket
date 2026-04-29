import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import i18n from "@/locales/i18n";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email(i18n.t("VALIDATION.AUTH.EMAIL_INVALID")),
  password: z.string().min(1, i18n.t("VALIDATION.AUTH.PASSWORD_REQUIRED")),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await authService.login(data);

      navigate("/transactions/month");
      
    } catch (error) {
      // 3. Handle errors in Spanish for the UI
      if (
        error instanceof Error &&
        error.message.includes("Invalid login credentials")
      ) {
        setError("root", {
          type: "manual",
          message: t('AUTH_FORMS.LOGIN.ERROR_INVALID_CREDENTIALS'),
        });
      } else {
        setError("root", {
          type: "manual",
          message: t('AUTH_FORMS.LOGIN.ERROR_UNEXPECTED'),
        });
      }
    }
  };

  // 4. UI RENDERING: Spanish text and native spread of register()
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm mx-auto"
    >
      <FormInput
        label={t('AUTH_FORMS.LOGIN.EMAIL_LABEL')}
        type="email"
        placeholder={t('AUTH_FORMS.LOGIN.EMAIL_PLACEHOLDER')}
        {...register("email")}
        error={errors.email?.message}
      />

      <FormInput
        label={t('AUTH_FORMS.LOGIN.PASSWORD_LABEL')}
        type="password"
        placeholder={t('AUTH_FORMS.LOGIN.PASSWORD_PLACEHOLDER')}
        {...register("password")}
        error={errors.password?.message}
      />

      {errors.root && (
        <div className="text-sm font-medium text-red-500">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? t('AUTH_FORMS.LOGIN.SUBMITTING') : t('AUTH_FORMS.LOGIN.SUBMIT')}
      </Button>
    </form>
  );
}
