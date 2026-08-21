import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import SurveyReportTemplate from "../pages/SurveyPreview/components/SurveyReportTemplate";

export const generateSurveyPdf = async (survey) => {
  // Render the template off-screen (not visible to the user)
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-10000px";
  container.style.left = "-10000px";
  document.body.appendChild(container);

  const root = createRoot(container);

  await new Promise((resolve) => {
    root.render(<SurveyReportTemplate survey={survey} />);
    // Give React a tick to actually paint before capturing
    setTimeout(resolve, 100);
  });

  try {
    const canvas = await html2canvas(container.firstChild, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Survey-Report-${survey.survey_information?.survey_id || "report"}.pdf`);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
};