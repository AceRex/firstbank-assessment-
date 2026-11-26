import { Outlet } from "react-router";
import IdUpdateFlowProvider from "../features/id-document-update/IdUpdateFlowProvider";

/**
 * Parent route for every step of the ID Document Update flow. It keeps one
 * IdUpdateFlowProvider mounted while the customer moves between steps, so shared state survives.
 * Each page sets its own width (the consent form is wider than the form steps).
 */
export default function IdUpdateFlowLayout() {
  return (
    <IdUpdateFlowProvider>
      <Outlet />
    </IdUpdateFlowProvider>
  );
}
