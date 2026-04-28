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
            Detalles del Usuario
          </SheetTitle>
        </SheetHeader>

        {/* Read-only Data */}
        <div className="mt-6 space-y-2 text-sm text-muted-foreground mb-6 border-b pb-4">
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Rol:</strong> {userData.role_name}
          </p>
          <p>
            <strong>ID:</strong> <span className="text-xs">{userData.id}</span>
          </p>
          <p>
            <strong>Fecha de Registro:</strong>{" "}
            <span className="text-xs">{userData.created_at}</span>
          </p>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
          <FormInput
            label="Nombre"
            type="text"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <FormInput
            label="Apellidos"
            type="text"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
          <FormInput
            label="Teléfono"
            type="text"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FormInput
            label="Fecha de Nacimiento"
            type="date"
            error={errors.birthdate?.message}
            {...register("birthdate")}
          />
          <FormInput
            label="Dirección"
            type="text"
            error={errors.address?.message}
            {...register("address")}
          />
          <div className="flex gap-4">
            <FormInput
              label="Ciudad"
              type="text"
              error={errors.city?.message}
              {...register("city")}
            />
            <FormInput
              label="Código Postal"
              type="text"
              error={errors.postal_code?.message}
              {...register("postal_code")}
            />
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">Rol del Sistema</label>
            <Controller
              name="role_name"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="user">Usuario Básico</option>
                  <option value="premium">Usuario Premium</option>
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
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>

        {/* Danger Zone: Double Confirmation Delete */}
        <div className="mt-8 pt-6 border-t border-destructive/20">
          <h4 className="text-sm font-semibold text-destructive mb-4">
            Zona de Peligro
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
