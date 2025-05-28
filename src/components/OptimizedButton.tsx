
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OptimizedButtonProps {
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
}

export const OptimizedButton: React.FC<OptimizedButtonProps> = ({
  onClick,
  children,
  className,
  disabled = false,
  variant = "default",
  size = "default",
  type = "button"
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!onClick || isLoading || disabled) return;

    try {
      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onClick, isLoading, disabled]);

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        "transition-all duration-150 ease-in-out",
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Aguarde...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
