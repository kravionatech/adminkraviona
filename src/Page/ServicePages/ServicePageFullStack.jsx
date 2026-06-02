import { FiCode } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageFullStack() {
  return <ServicePageEditor slug="full-stack-development" initial={SERVICE_PAGE_DATA["full-stack-development"]} icon={FiCode} displayTitle="Full Stack" />;
}
