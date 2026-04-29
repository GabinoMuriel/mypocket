import { useId, forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

// forwardRef is required for react-hook-form to connect to the input
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, description, className, id: externalId, ...props }, ref) => {
    const { t } = useTranslation();

    const internalId = useId();
    const id = externalId || internalId;
    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;

    const isPasswordField = props.type === "password";
    const [isVisible, setIsVisible] = useState(false);

    const renderType = isPasswordField
      ? (isVisible ? "text" : "password")
      : props.type;

    return (
      <div className="max-w-sm w-full space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : description ? descriptionId : undefined
            }
            {...props}
            className={cn(className, isPasswordField && "pr-10")}
            type={renderType}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={isVisible ? t('COMMON.HIDE_PASSWORD') : t('COMMON.SHOW_PASSWORD')}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;