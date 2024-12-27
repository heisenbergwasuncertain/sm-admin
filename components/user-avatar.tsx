import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export function UserAvatar() {
  const { user } = useAuth()

  return (
    <Avatar>
      <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name || "User avatar"} />
      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
    </Avatar>
  )
}

