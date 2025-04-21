import { cva } from 'class-variance-authority'
import { AlertTriangle, CircleX, Info } from 'lucide-react'
import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'type' | 'icon'
> & {
  title?: ReactNode;
  /**
   * @defaultValue info
   */
  type?: 'info' | 'warn' | 'error';

  /**
   * Force an icon
   */
  icon?: ReactNode;
};

const calloutVariants = cva(
  'my-6 flex flex-row gap-2 rounded-lg border border-s-2 bg-card p-3 text-sm text-card-foreground shadow-md',
  {
    variants: {
      type: {
        info: 'border-s-blue-500/50',
        warn: 'border-s-orange-500/50',
        error: 'border-s-red-500/50',
      },
    },
  },
);

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = 'info', icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          calloutVariants({
            type: type,
          }),
          className,
        )}
        {...props}
      >
        {icon ??
          {
            info: <Info className="size-5 fill-blue-500 text-card" />,
            warn: (
              <AlertTriangle className="size-5 fill-orange-500 text-card" />
            ),
            error: <CircleX className="size-5 fill-red-500 text-card" />,
          }[type]}
        <div className="min-w-0 flex-1">
          {title ? <p className="not-prose mb-2 font-medium">{title}</p> : null}
          <div className="text-muted-foreground prose-no-margin">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Callout.displayName = 'Callout';
