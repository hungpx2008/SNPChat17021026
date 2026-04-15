import type { LucideIcon } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: LucideIcon;
  tooltip: string;
  iconClassName?: string;
}

/**
 * Button with icon and tooltip — replaces repeated
 * TooltipProvider > Tooltip > TooltipTrigger > Button > Icon pattern.
 */
export function IconButton({
  icon: Icon,
  tooltip,
  iconClassName,
  variant = 'ghost',
  size = 'icon',
  className = 'h-7 w-7',
  ...props
}: IconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} className={className} {...props}>
            <Icon className={iconClassName} />
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
