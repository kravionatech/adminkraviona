import { FiPackage } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageSaas() {
  return <ServicePageEditor slug="saas-development" initial={SERVICE_PAGE_DATA["saas-development"]} icon={FiPackage} displayTitle="SaaS Dev" />;
}
