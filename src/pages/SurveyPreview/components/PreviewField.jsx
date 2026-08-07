import "../PreviewField.css";

export default function PreviewField({
  label,
  value,
  type = "text",
}) {
  const getValue = () => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (type === "boolean") {
      return value ? "Yes" : "No";
    }

    if (type === "date") {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return value;
  };

  return (
    <div className="preview-field">
      <label>{label}</label>

      <div className="preview-value">
        {getValue()}
      </div>
    </div>
  );
}