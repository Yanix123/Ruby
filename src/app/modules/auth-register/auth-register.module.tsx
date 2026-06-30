import { type FC } from 'react'

import { AuthRegister } from '@/features/auth-register'

// interface
interface IProps {}

// component
const AuthRegisterModule: FC<Readonly<IProps>> = () => {
  // render
  return (
    <div className='flex justify-center py-8'>
      <AuthRegister />
    </div>
  )
}

export { AuthRegisterModule }
