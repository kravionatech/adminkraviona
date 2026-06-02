import { FiCode } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageNode() {
  return <ServicePageEditor slug="nodejs-development" initial={SERVICE_PAGE_DATA["nodejs-development"]} icon={FiCode} displayTitle="Node.js" />;
}
