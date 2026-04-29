import { useState, useEffect, useMemo } from "react";
import { adminService, type AdminUserProfile } from "@/services/admin.service";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Shield, User as UserIcon, Loader2, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserView } from "./components/UserView";
import LogoLoader from "@/components/app/LogoLoader";
import { useTranslation } from "react-i18next";

export default function UsersPanelPage() {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(
    null,
  );

  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(t('ADMIN_USERS_PANEL.PAGE.ERROR_LOADING'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Local Search Filtering Logic
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();

    return users.filter((user) => {
      const fullName =
        `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
      return (
        fullName.includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
      );
    });
  }, [users, searchTerm]);

  if (isLoading)
    return (
      <LogoLoader />
    );
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('ADMIN_USERS_PANEL.PAGE.TITLE')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('ADMIN_USERS_PANEL.PAGE.DESCRIPTION')}
          </p>
        </div>

        {/* Search Input UI */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('ADMIN_USERS_PANEL.PAGE.SEARCH_PLACEHOLDER')}
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
                <th className="px-6 py-4 font-medium">{t('ADMIN_USERS_PANEL.PAGE.TABLE_HEADERS.USER')}</th>
                <th className="px-6 py-4 font-medium">{t('ADMIN_USERS_PANEL.PAGE.TABLE_HEADERS.CONTACT')}</th>
                <th className="px-6 py-4 font-medium">{t('ADMIN_USERS_PANEL.PAGE.TABLE_HEADERS.REGISTRATION_DATE')}</th>
                <th className="px-6 py-4 font-medium text-center">{t('ADMIN_USERS_PANEL.PAGE.TABLE_HEADERS.ROLE')}</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t">
              {filteredUsers.map((user) => {
                const isAdmin = user.role_name === "admin";
                const isPremium = user.role_name === "premium";

                const roleConfig = isAdmin
                  ? {
                    label: t('ADMIN_USERS_PANEL.PAGE.ROLES.ADMIN'),
                    icon: <Shield className="w-3.5 h-3.5" />,
                    var: "admin",
                  }
                  : isPremium
                    ? {
                      label: t('ADMIN_USERS_PANEL.PAGE.ROLES.PREMIUM'),
                      icon: <Star className="w-3.5 h-3.5" />,
                      var: "premium",
                    }
                    : {
                      label: t('ADMIN_USERS_PANEL.PAGE.ROLES.USER'),
                      icon: <UserIcon className="w-3.5 h-3.5" />,
                      var: "user",
                    };

                return (
                  <tr
                    key={user.id}
                    className={`
                        transition-colors
                        ${isAdmin
                        ? 'cursor-not-allowed opacity-80'
                        : 'cursor-pointer hover:bg-muted/50'}
                    `}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                          : t('ADMIN_USERS_PANEL.PAGE.EMPTY_STATES.NO_NAME')}
                      </div>
                      <div className="text-xs text-muted-foreground truncate w-48 mt-0.5">
                        ID: {user.id}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="font-medium text-foreground">
                        {user.email}
                      </div>
                      <div className="text-xs">
                        {user.phone || t('ADMIN_USERS_PANEL.PAGE.EMPTY_STATES.NO_PHONE')}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(user.created_at), "d MMM yyyy", {
                        locale: i18n.language === "en" ? enUS : es,
                      })}
                    </td>

                    <td className="px-6 py-4 flex justify-center">
                      <span
                        className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          bg-[var(--${roleConfig.var}-background)] 
                          text-[var(--${roleConfig.var})] 
                          border-[var(--${roleConfig.var})]
                        `}
                      >
                        {roleConfig.icon}
                        {roleConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 3. Render the panel outside the table when a user is selected */}
          {selectedUser && selectedUser.role_name !== "admin" && (
            <UserView
              userData={selectedUser}
              onClose={() => setSelectedUser(null)}
              onSuccess={() => {
                setSelectedUser(null);
                fetchUsers();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
