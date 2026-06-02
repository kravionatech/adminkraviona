import { FiZap } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePagePerf() {
  return <ServicePageEditor slug="web-performance-optimization" initial={SERVICE_PAGE_DATA["web-performance-optimization"]} icon={FiZap} displayTitle="Web Performance" />;
}
