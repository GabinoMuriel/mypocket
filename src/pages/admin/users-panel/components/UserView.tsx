import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/app/forms/FormInput";
import { adminService, type AdminUserProfile } from "@/services/admin.service";
import {
  profileSchema,
  type ProfileFormValues,
  type RoleName,
} from "@/types/profile.schema";
import { DeleteUserDialog } from "./DeleteUserDialog"; // Import the dialog we created earlier
import { useTranslation } from "react-i18next";

interface AdminUserPanelProps {
  userData: AdminUserProfile;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserView({
  userData,
  onClose,
  onSuccess,
}: AdminUserPanelProps) {
  const [open, setOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: userData.first_name ?? "",
      last_name: userData.last_name ?? "",
      birthdate: userData.birthdate ?? "",
      phone: userData.phone ?? "",
      address: userData.address ?? "",
      city: userData.city ?? "",
      postal_code: userData.postal_code ?? "",
      role_name: (userData.role_name as RoleName) ?? "user",
    },
  });

  // Handle closing animation correctly before unmounting
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => onClose(), 300); // Wait for sheet exit animation
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await adminService.updateUser(userData.id, data);

      handleOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto flex flex-col p-3">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {t('ADMIN_USERS_PANEL.USER_VIEW.TITLE')}
          </SheetTitle>
        </SheetHeader>

        {/* Read-only Data */}
        <div className="mt-6 space-y-2 text-sm text-muted-foreground mb-6 border-b pb-4">
          <p>
            <strong>{t('ADMIN_USERS_PANEL.USER_VIEW.LABELS.EMAIL')}</strong> {userData.email}
          </p>
          <p>
            <strong>{t('ADMIN_USERS_PANEL.USER_VIEW.LABELS.ROLE')}</strong> {userData.role_name}
          </p>
          <p>
            <strong>{t('ADMIN_USERS_PANEL.USER_VIEW.LABELS.ID')}</strong> <span className="text-xs">{userData.id}</span>
          </p>
          <p>
            <strong>{t('ADMIN_USERS_PANEL.USER_VIEW.LABELS.REGISTRATION_DATE')}</strong>{" "}
            <span className="text-xs">{userData.created_at}</span>
          </p>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <FormInput
            label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.FIRST_NAME')}
            type="text"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <FormInput
            label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.LAST_NAME')}
            type="text"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
          <FormInput
            label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.PHONE')}
            type="text"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FormInput
            label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.BIRTHDATE')}
            type="date"
            error={errors.birthdate?.message}
            {...register("birthdate")}
          />
          <FormInput
            label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.ADDRESS')}
            type="text"
            error={errors.address?.message}
            {...register("address")}
          />
          <div className="flex gap-4">
            <FormInput
              label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.CITY')}
              type="text"
              error={errors.city?.message}
              {...register("city")}
            />
            <FormInput
              label={t('ADMIN_USERS_PANEL.USER_VIEW.FORM.POSTAL_CODE')}
              type="text"
              error={errors.postal_code?.message}
              {...register("postal_code")}
            />
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">{t('ADMIN_USERS_PANEL.USER_VIEW.FORM.SYSTEM_ROLE')}</label>
            <Controller
              name="role_name"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="user">{t('ADMIN_USERS_PANEL.USER_VIEW.FORM.ROLE_OPTIONS.BASIC')}</option>
                  <option value="premium">{t('ADMIN_USERS_PANEL.USER_VIEW.FORM.ROLE_OPTIONS.PREMIUM')}</option>
                </select>
              )}
            />
            {errors.role_name && (
              <p className="text-sm text-destructive">
                {errors.role_name.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? t('ADMIN_USERS_PANEL.USER_VIEW.FORM.SAVING') : t('ADMIN_USERS_PANEL.USER_VIEW.FORM.SAVE_CHANGES')}
          </Button>
        </form>

        {/* Danger Zone: Double Confirmation Delete */}
        <div className="mt-8 pt-6 border-t border-destructive/20">
          <h4 className="text-sm font-semibold text-destructive mb-4">
            {t('ADMIN_USERS_PANEL.USER_VIEW.DANGER_ZONE')}
          </h4>
          <DeleteUserDialog
            userId={userData.id}
            userEmail={userData.email}
            onSuccess={() => {
              handleOpenChange(false);
              if (onSuccess) onSuccess();
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
