import "../SurveyPreview.css";

export default function FloorDetailsTable({
  floors = [],
}) {
  if (!floors.length) return null;

  return (
    <div className="floor-section">

      <h4>Floor Details</h4>

      <div className="floor-table-wrapper">

        <table className="floor-table">

          <thead>

            <tr>

              <th>Floor</th>

              <th>Area</th>

              <th>Usage Factor</th>

              <th>Usage Type</th>

              <th>Construction</th>

              <th>Roof</th>

              <th>Tenant</th>

              <th>Mobile</th>

              <th>Shops</th>

            </tr>

          </thead>

          <tbody>

            {floors.map((floor, index) => (

              <tr key={index}>

                <td>{floor.floor}</td>

                <td>{floor.area}</td>

                <td>{floor.usage_factor}</td>

                <td>{floor.usage_type}</td>

                <td>{floor.construction_type}</td>

                <td>{floor.roof_type}</td>

                <td>{floor.tenant_name || "-"}</td>

                <td>{floor.tenant_mobile || "-"}</td>

                <td>{floor.shops_count}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}