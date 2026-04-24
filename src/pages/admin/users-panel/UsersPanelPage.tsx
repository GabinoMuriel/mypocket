import { useState, useEffect } from "react";
import { adminService, type AdminUserProfile } from "@/services/admin.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Shield, User as UserIcon, Loader2 } from "lucide-react";

export default function UsersPanelPage() {
    const [users, setUsers] = useState<AdminUserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch the global users list on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminService.getAllUsers();
                setUsers(data);
            } catch (err: any) {
                setError("Error al cargar la lista de usuarios.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 2. Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // 3. Error State
    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    // 4. Main Admin UI
    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                <p className="text-muted-foreground mt-1">
                    Administra todos los usuarios registrados en la plataforma MyPocket.
                </p>
            </div>

            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Usuario</th>
                                <th className="px-6 py-4 font-medium">Teléfono</th>
                                <th className="px-6 py-4 font-medium">Fecha de Registro</th>
                                <th className="px-6 py-4 font-medium text-center">Rol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-t">
                            {users.map((user) => {
                                const isAdmin = user.roles?.name === 'admin';

                                return (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        {/* Name & ID Column */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">
                                                {user.first_name || user.last_name
                                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                    : 'Usuario sin nombre'}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate w-48 mt-0.5">
                                                ID: {user.id}
                                            </div>
                                        </td>

                                        {/* Phone Column */}
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {user.phone || 'No especificado'}
                                        </td>

                                        {/* Registration Date Column */}
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(user.created_at), "d MMM yyyy", { locale: es })}
                                        </td>

                                        {/* Role Badge Column */}
                                        <td className="px-6 py-4 flex justify-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isAdmin
                                                    ? 'bg-violet-100 text-violet-700 border border-violet-200'
                                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                }`}>
                                                {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                                                {isAdmin ? 'Admin' : 'Usuario'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}