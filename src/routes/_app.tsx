import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div>
      <h1>TaskFlow App</h1>
      <Outlet />
    </div>
  );
}