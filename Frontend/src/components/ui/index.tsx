import React from 'react';
import { cn } from '@/lib/utils';

// ===========================
// Button Component
// ===========================

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'whatsapp' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-xl transition-all duration-200 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white shadow-[0_4px_12px_rgba(255,107,0,0.30)] hover:shadow-[0_6px_16px_rgba(255,107,0,0.40)] hover:from-[#E05500] hover:to-[#FF6B00]',
    secondary:
      'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.35)]',
    whatsapp:
      'bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_16px_rgba(37,211,102,0.4)]',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    outline: 'border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </button>
  );
}

// ===========================
// Badge Component
// ===========================

interface BadgeProps {
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ status = 'neutral', children, className, dot }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-slate-100 text-slate-600',
    purple: 'bg-purple-100 text-purple-700',
  };

  const dots = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase',
        variants[status],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dots[status])} />}
      {children}
    </span>
  );
}

// ===========================
// Card Component
// ===========================

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  topBorder?: 'orange' | 'green' | 'red' | 'purple' | 'blue';
  onClick?: () => void;
  style?: React.CSSProperties;
  [key: string]: any;  // allow extra props like 'key' from JSX
}

export function Card({ children, className, hover, topBorder, onClick, style }: CardProps) {
  const borders = {
    orange: 'border-t-2 border-t-[#FF6B00]',
    green: 'border-t-2 border-t-green-500',
    red: 'border-t-2 border-t-red-500',
    purple: 'border-t-2 border-t-purple-500',
    blue: 'border-t-2 border-t-blue-500',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        topBorder && borders[topBorder],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

// ===========================
// InputField Component
// ===========================

type InputFieldProps = React.ComponentPropsWithoutRef<'input'> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
};

export function InputField({
  label,
  error,
  icon,
  hint,
  required,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl',
            'focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15',
            'placeholder:text-slate-400 text-slate-800 transition-all',
            'disabled:bg-slate-50 disabled:text-slate-500',
            icon && 'pl-10',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-500/15',
            className
          )}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ===========================
// SelectField Component
// ===========================

type SelectFieldProps = React.ComponentPropsWithoutRef<'select'> & {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
};

export function SelectField({
  label,
  error,
  required,
  options,
  placeholder,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl',
          'focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15',
          'text-slate-800 transition-all cursor-pointer',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ===========================
// Modal Component
// ===========================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          'bg-white rounded-2xl w-full shadow-2xl overflow-hidden',
          'animate-[modalIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]',
          sizes[size]
        )}
        style={{
          animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors ml-4 shrink-0 text-xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================
// Toast Component
// ===========================

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const configs = {
    success: {
      bg: 'bg-green-600',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-600',
      icon: '✕',
    },
    info: {
      bg: 'bg-blue-600',
      icon: 'ℹ',
    },
  };
  const cfg = configs[type];

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl',
        'animate-[toastIn_0.3s_ease]',
        cfg.bg
      )}
    >
      <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
        {cfg.icon}
      </span>
      {message}
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

// ===========================
// Skeleton Loader
// ===========================

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100',
            'bg-[length:400%_100%]',
            'animate-[shimmer_1.5s_ease_infinite]',
            'rounded-lg',
            className
          )}
        />
      ))}
    </>
  );
}

// ===========================
// Page Header Component
// ===========================

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, breadcrumb, icon, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            {icon}
          </div>
        )}
        <div>
          {breadcrumb && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              {breadcrumb}
            </p>
          )}
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ===========================
// Stat Card Component
// ===========================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  iconBg?: string;
  topBorder?: 'orange' | 'green' | 'red' | 'purple' | 'blue';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  iconBg = 'bg-orange-50 text-orange-600',
  topBorder,
}: StatCardProps) {
  return (
    <Card hover topBorder={topBorder} className="p-5">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <div>
        <div className="font-display font-bold text-2xl text-slate-900 font-mono tracking-tight">
          {value}
        </div>
        {trend && (
          <p
            className={cn(
              'text-xs font-semibold mt-1 flex items-center gap-1',
              trend.positive ? 'text-green-600' : 'text-red-500'
            )}
          >
            <span>{trend.positive ? '↑' : '↓'}</span>
            {trend.value}
          </p>
        )}
        {subtitle && !trend && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}

// ===========================
// Empty State Component
// ===========================

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ===========================
// Avatar Component
// ===========================

interface AvatarProps {
  name: string;
  initials?: string;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export function Avatar({ name, initials, colorClass = 'bg-orange-100 text-orange-700', size = 'md', src }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const chars = initials || name.substring(0, 2).toUpperCase();
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold shrink-0', sizes[size], colorClass)}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover rounded-full" /> : chars}
    </div>
  );
}

// ===========================
// Tabs Component
// ===========================

interface TabsProps {
  tabs: Array<{ id: string; label: string; count?: number }>;
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 bg-slate-100 p-1 rounded-xl w-fit', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap',
            active === tab.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                active === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ===========================
// Search Input Component
// ===========================

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 transition-all"
      />
    </div>
  );
}
