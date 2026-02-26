import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-blue-500/20 text-blue-300',
        variant === 'success' && 'bg-green-500/20 text-green-300',
        variant === 'warning' && 'bg-yellow-500/20 text-yellow-300',
        variant === 'danger' && 'bg-red-500/20 text-red-300',
        className
      )}
      {...props}
    />
  )
}
