import { useId, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// By extending InputHTMLAttributes, you get all native input props (onChange, onBlur, etc.) safely
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export default function FormInput({
  label,
  error,
  description,
  id: externalId,
  ...props
}: FormInputProps) {
  const internalId = useId();
  const id = externalId || internalId;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="max-w-sm w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : description ? descriptionId : undefined}
        {...props}
      />
      {description && !error && <p id={descriptionId} className="text-sm text-muted-foreground">{description}</p>}
      {error && <p id={errorId} className="text-sm text-destructive">{error}</p>}
    </div>
  );
}