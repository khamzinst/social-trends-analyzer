import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfilePage } from '@/components/profile/profile-page'

export default async function UserProfilePage() {
  const auth = await getAuthUser()
  const user = await prisma.user.findUnique({
    where: { id: auth!.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return <ProfilePage user={user!} />
}
