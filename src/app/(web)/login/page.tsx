import { type NextPage } from 'next'

import { AuthLoginModule } from '@/modules/auth-login'

// interface
interface IProps {}

// component
const LoginPage: NextPage<Readonly<IProps>> = () => {
  // render
  return <AuthLoginModule />
}

export default LoginPage
