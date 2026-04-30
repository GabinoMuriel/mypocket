import { Link } from "react-router-dom";
import { NavigationMenuLink } from "@/components/ui/navigation-menu"; // Adjust if needed
import React from "react";
import { cn } from "@/lib/utils";

// Inside your ListItem component definition:
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, href, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        {/* We keep the prop as 'href' but pass it to the 'to' attribute of React Router's Link */}
        <Link to={href || "#"} ref={ref as React.Ref<HTMLAnchorElement> | undefined} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon}
            <span>{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default ListItem;