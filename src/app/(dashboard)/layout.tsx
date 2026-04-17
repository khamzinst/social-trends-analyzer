import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { LayoutShell } from '@/components/layout/layout-shell'
import { Toaster } from '@/components/ui/toaster'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <LayoutShell user={{ name: user.name, email: user.email }}>
        {children}
      </LayoutShell>
      <Toaster />
    </>
  )
}
