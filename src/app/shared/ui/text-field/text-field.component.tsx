import { forwardRef } from "react";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

// Accessible input: associated <label>, aria-invalid, and aria-describedby → error.
// forwardRef so it composes with react-hook-form's `register`.
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, name, className, ...props }, ref) {
    const inputId = id ?? name;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
        <input
          id={inputId}
          name={name}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={
            className ??
            "w-full rounded-lg border border-black/[.12] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.2]"
          }
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);
