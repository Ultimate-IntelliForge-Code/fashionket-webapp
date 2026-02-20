import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/_vendorLayout/account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vendor/_vendorLayout/account/"!</div>
}
