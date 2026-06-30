import { type NextPage } from 'next'

import { AuthRegisterModule } from '@/modules/auth-register'

// interface
interface IProps {}

// component
const RegisterPage: NextPage<Readonly<IProps>> = () => {
  // render
  return <AuthRegisterModule />
}

export default RegisterPage
