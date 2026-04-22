import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";

export default function UpdateAvatarForm() {
    const { user, profile, setProfile } = useAuthStore();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if the FileList exists and has at least one file
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setSuccess(false);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        // Optional client-side size validation (e.g., max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("La imagen no debe superar los 2MB.");
            return;
        }

        setIsUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const updatedProfile = await authService.uploadAvatar(user.id, file);

            // Update global Zustand state with the new avatar URL
            setProfile(updatedProfile);
            setSuccess(true);
            setFile(null); // Reset input
        } catch (err) {
            console.error(err);
            setError("Error al subir la imagen. Asegúrate de tener conexión.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6 py-4 flex flex-col items-center">
            {/* Avatar Preview Circle */}
            <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                )}
            </div>

            {/* File Upload Controls */}
            <div className="w-full max-w-sm space-y-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />

                {error && <div className="text-sm font-medium text-red-500 text-center">{error}</div>}
                {success && <div className="text-sm font-medium text-green-500 text-center">¡Avatar actualizado con éxito!</div>}

                <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                    {isUploading ? "Subiendo imagen..." : "Subir nuevo avatar"}
                </Button>
            </div>
        </div>
    );
}