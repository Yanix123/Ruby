'use client'

import { ErrorModule } from '@/modules/error'

export default function WebError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorModule {...props} />
}
