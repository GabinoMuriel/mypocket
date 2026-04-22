import { useId, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

// forwardRef is required for react-hook-form to connect to the input
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, description, className, id: externalId, ...props }, ref) => {
    const internalId = useId();
    const id = externalId || internalId;
    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;

    return (
      <div className="max-w-sm w-full space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          ref={ref} // <-- This is the magic link for react-hook-form!
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          className={className}
          {...props}
        />
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