import { FiTrendingUp } from "react-icons/fi";
import ServicePageEditor from "./ServicePageEditor";
import { SERVICE_PAGE_DATA } from "./servicePageData";

export default function ServicePageSeo() {
  return <ServicePageEditor slug="technical-seo" initial={SERVICE_PAGE_DATA["technical-seo"]} icon={FiTrendingUp} displayTitle="Technical SEO" />;
}
