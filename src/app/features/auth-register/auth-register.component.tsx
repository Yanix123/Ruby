'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'
import { useForm } from 'react-hook-form'

import type { ISignUpValues } from '@/entities/models'
import { Button } from '@/pkg/theme/ui/button'
import { signUp } from '@/shared/auth'
import { TextField } from '@/shared/ui/text-field'

// interface
interface IProps {}

// component
const AuthRegister: FC<Readonly<IProps>> = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ISignUpValues>()

  const onSubmit = handleSubmit(async (v) => {
    try {
      const { error } = await signUp.email({
        name: v.name,
        email: v.email,
        password: v.password,
      })
      if (error) {
        setError('root', { message: error.message ?? 'Registration failed' })
        return
      }
      router.push('/movies')
      router.refresh()
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  })

  // render
  return (
    <form onSubmit={onSubmit} className='flex w-full max-w-sm flex-col gap-4'>
      <h1 className='text-2xl font-semibold tracking-tight'>Create account</h1>

      <TextField
        label='Name'
        autoComplete='name'
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />

      <TextField
        label='Email'
        type='email'
        autoComplete='email'
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
            message: 'Invalid email',
          },
        })}
      />

      <TextField
        label='Password'
        type='password'
        autoComplete='new-password'
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Min 8 characters' },
        })}
      />

      {errors.root && (
        <p role='alert' className='text-sm text-red-600'>
          {errors.root.message}
        </p>
      )}

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create account'}
      </Button>

      <p className='text-sm text-zinc-600 dark:text-zinc-400'>
        Already have an account?{' '}
        <Link href='/login' className='underline'>
          Sign in
        </Link>
      </p>
    </form>
  )
}

export { AuthRegister }
