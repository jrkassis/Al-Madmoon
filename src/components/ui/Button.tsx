import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantClassMap: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const sizeClassMap: Record<string, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      type,
      ...props
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const classes = [
      'btn',
      variantClassMap[variant] || variantClassMap['primary'],
      sizeClassMap[size] || sizeClassMap['md'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Ensure a type is always set for button elements (default: 'button')
    const buttonType =
      typeof type !== 'undefined' ? type : 'button';

    return (
      <button
        ref={ref}
        className={classes}
        type={buttonType}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
