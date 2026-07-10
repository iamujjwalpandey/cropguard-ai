import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-premium-gradient text-black shadow-glow hover:brightness-110',
        secondary: 'border border-emerald-400/25 bg-white/5 text-white hover:bg-emerald-400/10 hover:text-emerald-100',
        ghost: 'text-emerald-100 hover:bg-emerald-400/10 hover:text-white',
        outline: 'border border-emerald-400/30 bg-transparent text-emerald-50 hover:bg-emerald-400/10',
        destructive: 'bg-red-500/15 text-red-100 border border-red-400/30 hover:bg-red-500/25',
        muted: 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-14 rounded-2xl px-7 text-base',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
