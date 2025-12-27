import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionShellProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'dark' | 'light';
}

export function SectionShell({ children, className, id, background = 'dark' }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-20 px-4 md:px-8',
        {
          'bg-cobre-dark text-white': background === 'dark',
          'bg-white text-cobre-dark': background === 'light',
        },
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </section>
  );
}

