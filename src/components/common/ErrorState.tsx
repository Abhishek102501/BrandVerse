import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />

      <h2 className="text-2xl font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-muted-foreground">
        {description}
      </p>

      {onRetry && (
        <Button className="mt-6" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}