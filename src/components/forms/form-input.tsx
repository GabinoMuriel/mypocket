import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "date";
  error?: string;
  description?: string;
  // This allows you to pass any other standard input props (onChange, value, etc.)
  [x: string]: any;
}

export default function FormInput({
  label,
  placeholder,
  type = "text",
  error,
  description,
  ...props
}: FormInputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="max-w-sm w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : description ? descriptionId : undefined
        }
        className="peer"
        {...props}
      />

      {description && !error && (
        <p id={descriptionId} className="text-muted-foreground text-xs">
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          aria-live="polite"
          className="text-destructive text-xs font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}