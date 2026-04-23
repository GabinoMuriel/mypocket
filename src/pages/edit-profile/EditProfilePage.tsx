import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoForm from "@/components/app/forms/BasicInfoForm";
import ChangePasswordForm from "@/components/app/forms/ChangePasswordForm";
import UpdateAvatarForm from "@/components/app/forms/UpdateAvatarForm";
import { useAuthStore } from "@/store/useAuthStore";

export default function EditProfilePage() {

  const profile = useAuthStore((state) => state.profile);
  
  console.log("[EditProfilePage] Rendered. Profile data:", profile);
  
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Configuración de Perfil</h1>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-2">Tus Datos Personales</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Actualiza tu información personal y de contacto.
          </p>
          <BasicInfoForm />
        </TabsContent>

        <TabsContent value="password" className="mt-6 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-2">Cambiar Contraseña</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Asegúrate de usar una contraseña segura de al menos 6 caracteres.
          </p>
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="avatar" className="mt-6 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-2">Foto de Perfil</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sube una nueva imagen para tu avatar.
          </p>
          <UpdateAvatarForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}