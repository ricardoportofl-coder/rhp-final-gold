import { createFileRoute } from "@tanstack/react-router";
import DentalScheduler from "@/components/dental/DentalScheduler";

export const Route = createFileRoute("/dental")({
  component: DentalScheduler,
});
