import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoForm from "@/components/app/forms/BasicInfoForm";
import ChangePasswordForm from "@/components/app/forms/ChangePasswordForm";
import UpdateAvatarForm from "@/components/app/forms/UpdateAvatarForm";
import { useTranslation } from "react-i18next";

export default function EditProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{t('EDIT_PROFILE_PAGE.TITLE')}</h1>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" >{t('EDIT_PROFILE_PAGE.TABS.BASIC_INFO')}</TabsTrigger>
          <TabsTrigger value="password">{t('EDIT_PROFILE_PAGE.TABS.PASSWORD')}</TabsTrigger>
          <TabsTrigger value="avatar">{t('EDIT_PROFILE_PAGE.TABS.AVATAR')}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-2">{t('EDIT_PROFILE_PAGE.BASIC_INFO_SECTION.TITLE')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('EDIT_PROFILE_PAGE.BASIC_INFO_SECTION.DESC')}
          </p>
          <BasicInfoForm />
        </TabsContent>

        <TabsContent value="password" className="mt-6 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-2">{t('EDIT_PROFILE_PAGE.PASSWORD_SECTION.TITLE')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('EDIT_PROFILE_PAGE.PASSWORD_SECTION.DESC')}
          </p>
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="avatar" className="mt-6 border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-2">{t('EDIT_PROFILE_PAGE.AVATAR_SECTION.TITLE')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('EDIT_PROFILE_PAGE.AVATAR_SECTION.DESC')}
          </p>
          <UpdateAvatarForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}