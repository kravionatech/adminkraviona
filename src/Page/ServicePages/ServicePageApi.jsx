import { FiCloud } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageApi() {
  return <ServicePageEditor slug="api-development" initial={SERVICE_PAGE_DATA["api-development"]} icon={FiCloud} displayTitle="API Dev" />;
}
