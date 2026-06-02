import { FiDatabase } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageDatabase() {
  return <ServicePageEditor slug="database-architecture" initial={SERVICE_PAGE_DATA["database-architecture"]} icon={FiDatabase} displayTitle="Database Architecture" />;
}
