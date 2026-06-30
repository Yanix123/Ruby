import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/pkg/theme/lib/utils'
import { Label } from '@/pkg/theme/ui/label'

// interface
interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

// component
const TextField = forwardRef<HTMLInputElement, Readonly<IProps>>(function TextField(props, ref) {
  const { label, error, id, name, className, ...rest } = props
  const inputId = id ?? name
  const errorId = error ? `${inputId}-error` : undefined

  // render
  return (
    <div className='flex flex-col gap-1'>
      <Label htmlFor={inputId} className={cn({ 'text-destructive': error })}>
        {label}
      </Label>
      <input
        id={inputId}
        name={name}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
          { 'border-destructive': error },
          className,
        )}
        {...rest}
      />
      {error && (
        <p id={errorId} role='alert' className='text-destructive text-sm'>
          {error}
        </p>
      )}
    </div>
  )
})

export { TextField }
