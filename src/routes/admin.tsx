import { createFileRoute } from "@tanstack/react-router";
import { getAllAppointmentsFn } from "@/lib/dental/actions";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const appointments = await getAllAppointmentsFn();
    return { appointments };
  },
  component: AdminPage,
});

function AdminPage() {
  const { appointments } = Route.useLoaderData();
  return <AdminDashboard initialAppointments={appointments} />;
}
