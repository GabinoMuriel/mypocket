import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type React from "react";

type FloatingAddButtonProps = {
    component: React.ComponentType<{ trigger: React.ReactNode }>;
};

export function FloatingAddButton({ component: Component }: FloatingAddButtonProps) {
    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Component
                trigger={
                    <Button
                        size="icon"
                        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                    >
                        <Plus className="w-6 h-6" />
                    </Button>
                }
            />
        </div>
    );
}