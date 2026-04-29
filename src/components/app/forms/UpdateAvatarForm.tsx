import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UpdateAvatarForm() {
  const { user, profile, setProfile } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile?.avatar_url || null,
  );

  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create a temporary local URL for the image
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith("http")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUpload = async () => {
    if (!file || !user) return;

    // Optional client-side size validation (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(t('EDIT_PROFILE_PAGE.UPDATE_AVATAR_FORM.ERROR_SIZE'));
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedProfile = await authService.uploadAvatar(user.id, file);

      // Update global Zustand state with the new avatar URL
      if (updatedProfile) {
        setProfile(updatedProfile);
        setSuccess(true);
      } else {
        setError(t('EDIT_PROFILE_PAGE.UPDATE_AVATAR_FORM.ERROR_UPDATE'));
      }
    } catch (err) {
      console.error(err);
      setError(t('EDIT_PROFILE_PAGE.UPDATE_AVATAR_FORM.ERROR_UPLOAD'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted bg-secondary flex items-center justify-center shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-4xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm text-muted-foreground"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? t('EDIT_PROFILE_PAGE.UPDATE_AVATAR_FORM.SUBMITTING') : t('EDIT_PROFILE_PAGE.UPDATE_AVATAR_FORM.SUBMIT')}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      {success && (
        <p className="text-sm text-green-500 mt-2">
          {t('EDIT_PROFILE_PAGE.UPDATE_AVATAR_FORM.SUCCESS')}
        </p>
      )}
    </>
  );
}
