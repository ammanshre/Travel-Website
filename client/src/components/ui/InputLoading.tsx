import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
}

const InputLoading = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, loading, type, ...props }, ref) => {
    return (
      <div className="relative"> {/* Wrapper to position the spinner */}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            {
              'pr-10': loading, // Add right padding to make space for spinner
            }
          )}
          ref={ref}
          {...props}
          disabled={props.disabled || loading} // Disable input when loading
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center"> {/* Spinner positioned inside the input field */}
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
    )
  }
);

InputLoading.displayName = "Input";

export { InputLoading };
