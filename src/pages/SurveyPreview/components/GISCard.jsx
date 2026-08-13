import PreviewField from "./PreviewField";
import "../SectionCard.css";
import "../SurveyPreview.css";

export default function GISCard({ data, surveyInfo }) {
  if (!data) return null;

  const getBoolean = (value) => value === true;

  const openMap = () => {
    if (surveyInfo?.gps_latitude && surveyInfo?.gps_longitude) {
      window.open(
        `https://www.google.com/maps?q=${surveyInfo.gps_latitude},${surveyInfo.gps_longitude}`,
        "_blank",
      );
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>GIS Information</h3>
      </div>

      <div className="section-body">
        <PreviewField
          label="GIS Property Polygon"
          value={getBoolean(data.gis_property_polygon_available)}
          type="boolean"
        />

        <PreviewField
          label="Boundary Verified"
          value={getBoolean(data.property_boundary_verified)}
          type="boolean"
        />

        <PreviewField
          label="Geo Tag Completed"
          value={getBoolean(data.geo_tag_completed)}
          type="boolean"
        />

        <PreviewField
          label="Property Photo Captured"
          value={getBoolean(data.property_photo_captured)}
          type="boolean"
        />
      </div>

      <div className="gis-images">
        {data.front_elevation_photo_path && (
          <div className="image-card">
            <h4>Front Elevation</h4>

            <img src={data.front_elevation_photo_path} alt="Front Elevation" />
          </div>
        )}

        {data.name_plate_photo_path && (
          <div className="image-card">
            <h4>Name Plate</h4>

            <img src={data.name_plate_photo_path} alt="Name Plate" />
          </div>
        )}
        
        {data.property_photo_path && (
          <div className="image-card">
            <h4>Property Photo</h4>

            <img src={data.property_photo_path} alt="Property Photo" />
          </div>
        )}
      </div>

      {surveyInfo?.gps_latitude && surveyInfo?.gps_longitude && (
        <div className="map-btn-container">
          <button className="map-btn" onClick={openMap}>
            Open in Google Maps
          </button>
        </div>
      )}
    </div>
  );
}
