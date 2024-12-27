import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>Manage your notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add your notifications content here */}
          <p>List of notifications and management tools would be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

