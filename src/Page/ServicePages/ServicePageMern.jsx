import { FiCode } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageMern() {
  return <ServicePageEditor slug="mern-stack-development" initial={SERVICE_PAGE_DATA["mern-stack-development"]} icon={FiCode} displayTitle="MERN Stack" />;
}
