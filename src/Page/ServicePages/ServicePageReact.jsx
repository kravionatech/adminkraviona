import { FiCode } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageReact() {
  return <ServicePageEditor slug="react-development" initial={SERVICE_PAGE_DATA["react-development"]} icon={FiCode} displayTitle="React.js" />;
}
