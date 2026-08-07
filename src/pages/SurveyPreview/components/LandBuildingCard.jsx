import PreviewField from "./PreviewField";
import FloorDetailsTable from "./FloorDetailsTable";
import "../SectionCard.css";

export default function LandBuildingCard({ data }) {
  if (!data) return null;

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Land & Building Information</h3>
      </div>

      <div className="section-body">

        <PreviewField
          label="Plot Area (Sq. Ft.)"
          value={data.plot_area}
        />

        <PreviewField
          label="Plinth Area"
          value={data.plinth_area}
        />

        <PreviewField
          label="Year Of Construction"
          value={data.year_of_construction}
        />

        <PreviewField
          label="Building Age"
          value={`${data.building_age} Year(s)`}
        />

        <PreviewField
          label="Total Built-up Area"
          value={data.total_builtup_area}
        />

      </div>

      <FloorDetailsTable
        floors={data.floor_detail}
      />

    </div>
  );
}