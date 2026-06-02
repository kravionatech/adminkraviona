import { FiCpu } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageAi() {
  return <ServicePageEditor slug="ai-automation" initial={SERVICE_PAGE_DATA["ai-automation"]} icon={FiCpu} displayTitle="AI Automation" />;
}
