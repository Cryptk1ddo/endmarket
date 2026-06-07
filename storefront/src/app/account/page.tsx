import ProfileClient from "../profile/ProfileClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function AccountPage() {
  return <ProfileClient />
}
