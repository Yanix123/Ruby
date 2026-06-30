import { type FC } from 'react'

import { AuthLogin } from '@/features/auth-login'

// interface
interface IProps {}

// component
const AuthLoginModule: FC<Readonly<IProps>> = () => {
  // render
  return (
    <div className='flex justify-center py-8'>
      <AuthLogin />
    </div>
  )
}

export { AuthLoginModule }
