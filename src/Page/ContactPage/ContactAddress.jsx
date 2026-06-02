// Contact Page → Office Address + Map
import { FiMap } from "react-icons/fi";
import { PageHeader, PageShell, PageBody, Card, Field, Input, Textarea, Toggle, InfoBanner } from "../../Components/UI/FormPrimitives";
import { useSiteConfigForm } from "../../services/useSiteConfigForm";

const INITIAL = {
  showMap: true,
  addressLine1: "Kraviona Tech Solutions",
  addressLine2: "B-Block, Vivek Vihar",
  city: "East Delhi",
  state: "Delhi",
  postcode: "110092",
  country: "India",
  latitude: "28.6675",
  longitude: "77.3146",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.123!2d77.3146!3d28.6675!2m3!1f0!2f0!3f0",
  directionsLink: "https://maps.google.com/?q=East+Delhi+110092",
  zoomLevel: 14,
};

export default function ContactAddress() {
  const {  data, dirty, saving, saved, set, save  } = useSiteConfigForm(INITIAL, { section: "contactAddress" });
  return (
    <PageShell>
      <PageHeader breadcrumb={["Admin", "Contact Page", "Address"]} title="Contact: Office Address & Map" icon={FiMap}
        onSave={save} dirty={dirty} saving={saving} saved={saved} />
      <InfoBanner icon={FiMap}>Embedded Google Maps + formatted office address.</InfoBanner>
      <PageBody>
        <Card title="Map">
          <Field label="Show Map on Page"><Toggle value={data.showMap} onChange={set("showMap")} /></Field>
          <Field label="Google Maps Embed URL" hint="From Google Maps → Share → Embed a map"><Textarea value={data.googleMapsEmbedUrl} onChange={set("googleMapsEmbedUrl")} rows={3} mono /></Field>
          <Field label='"Get Directions" Link'><Input value={data.directionsLink} onChange={set("directionsLink")} mono /></Field>
        </Card>

        <Card title="Address">
          <Field label="Line 1"><Input value={data.addressLine1} onChange={set("addressLine1")} /></Field>
          <Field label="Line 2"><Input value={data.addressLine2} onChange={set("addressLine2")} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City"><Input value={data.city} onChange={set("city")} /></Field>
            <Field label="State / Province"><Input value={data.state} onChange={set("state")} /></Field>
            <Field label="Postcode"><Input value={data.postcode} onChange={set("postcode")} /></Field>
            <Field label="Country"><Input value={data.country} onChange={set("country")} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Latitude"><Input value={data.latitude} onChange={set("latitude")} mono /></Field>
            <Field label="Longitude"><Input value={data.longitude} onChange={set("longitude")} mono /></Field>
            <Field label="Zoom"><Input type="number" value={data.zoomLevel} onChange={set("zoomLevel")} /></Field>
          </div>
        </Card>
      </PageBody>
    </PageShell>
  );
}
