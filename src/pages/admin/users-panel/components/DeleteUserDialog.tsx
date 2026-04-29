import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Using lucide-react as specified in your stack [1]
import { adminService } from "@/services/admin.service";
import { useTranslation } from "react-i18next";

interface DeleteUserDialogProps {
    userId: string;
    userEmail: string;
    onSuccess?: () => void; // Callback to refresh the user list
}

export function DeleteUserDialog({ userId, userEmail, onSuccess }: DeleteUserDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslation();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await adminService.deleteUser(userId);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            {/* 1st Confirmation: Clicking the Delete Button */}
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto ">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('ADMIN_USERS_PANEL.DELETE_DIALOG.TRIGGER_BUTTON')}
                </Button>
            </AlertDialogTrigger>

            {/* 2nd Confirmation: The Modal Dialog */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('ADMIN_USERS_PANEL.DELETE_DIALOG.TITLE')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('ADMIN_USERS_PANEL.DELETE_DIALOG.DESC_PART_1')}<strong>{userEmail}</strong>{t('ADMIN_USERS_PANEL.DELETE_DIALOG.DESC_PART_2')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>{t('COMMON.CANCEL')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                    >
                        {isDeleting ? t('ADMIN_USERS_PANEL.DELETE_DIALOG.DELETING') : t('ADMIN_USERS_PANEL.DELETE_DIALOG.CONFIRM')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}