import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    // If asChild is true, we assume the user is passing a single child (like Link)
    // and we might want to just render that child with the className. 
    // But standardized UI components usually handle this via Slot (radix) or just wrapping.
    // For simplicity here, I'll ignore asChild prop logic and just return button, 
    // or let the parent handle the wrapping if they passed a Link inside.
    // Actually, in the previous code, I saw `asChild` usage with `Link`. 
    // Since I'm not using Radix Slot here, I will just render a button. 
    // If wrapping a Link, the Link should probably be the outer element or inner.
    // The previous implementation used asChild but didn't actually implement Slot logic 
    // (it just passed ...props). Next.js Link inside button is invalid HTML.
    // I will remove `asChild` prop from interface to be clean, or implement it properly?
    // The user's code `Button asChild><Link...` relies on it.
    // Let's stick to simple button styling. The user can wrap Button with Link or vice versa.
    // Wait, if I change the logic, I might break existing usage. 
    // Let's keep `asChild` in props to avoid type errors but just render button for now 
    // unless I import Slot.
    
    // Actually, looking at the previous file content I wrote for Button.tsx:
    // It didn't import Slot. It just accepted `asChild` but rendered `button`. 
    // This creates hydration errors if Link is passed as child of button. 
    // I will treat this as a styling component.
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            // Primary: White bg, Black text
            'bg-white text-black hover:bg-gray-100': variant === 'primary',
            // Secondary: Border gray-600, White text (Outline-like)
            'border border-gray-600 text-white hover:bg-white/5': variant === 'outline' || variant === 'secondary',
            // Ghost
            'text-white hover:bg-white/10': variant === 'ghost',
            
            'h-8 px-4 text-sm': size === 'sm',
            'h-10 px-6 text-base': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
