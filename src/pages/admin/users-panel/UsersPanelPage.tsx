import { useState, useEffect, useMemo } from "react";
import { adminService, type AdminUserProfile } from "@/services/admin.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Shield, User as UserIcon, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UsersPanelPage() {
    const [users, setUsers] = useState<AdminUserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🚀 NEW: Search state
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
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

    // 🚀 NEW: Local Search Filtering Logic
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerSearch = searchTerm.toLowerCase();

        return users.filter(user => {
            const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
            return (
                fullName.includes(lowerSearch) ||
                user.email.toLowerCase().includes(lowerSearch)
            );
        });
    }, [users, searchTerm]);

    if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground mt-1">
                        Administra todos los usuarios registrados en la plataforma.
                    </p>
                </div>

                {/* 🚀 NEW: Search Input UI */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Usuario</th>
                                <th className="px-6 py-4 font-medium">Contacto</th>
                                <th className="px-6 py-4 font-medium">Fecha de Registro</th>
                                <th className="px-6 py-4 font-medium text-center">Rol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-t">
                            {filteredUsers.map((user) => {
                                const isAdmin = user.role_name === 'admin'; // Using updated role_name

                                return (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
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

                                        <td className="px-6 py-4 text-muted-foreground">
                                            {/* 🚀 NEW: We can now display the email! */}
                                            <div className="font-medium text-foreground">{user.email}</div>
                                            <div className="text-xs">{user.phone || 'Sin teléfono'}</div>
                                        </td>

                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(user.created_at), "d MMM yyyy", { locale: es })}
                                        </td>

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