import { FiCloud } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageBackend() {
  return <ServicePageEditor slug="backend-development" initial={SERVICE_PAGE_DATA["backend-development"]} icon={FiCloud} displayTitle="Backend Dev" />;
}
