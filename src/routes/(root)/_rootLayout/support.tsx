import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(root)/_rootLayout/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming Soon...</div>
}
