import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function generateDashboardPdf(elementId = "dashboard-content") {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Dashboard content element not found");

  document.documentElement.classList.add("pdf-export-desktop");

  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    document.documentElement.classList.remove("pdf-export-desktop");
  }

  const PAGE_WIDTH = 297;
  const PAGE_HEIGHT = 210;
  const MARGIN = 5;
  const HEADING_HEIGHT = 12;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2 - HEADING_HEIGHT;

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(30, 30, 30);
  pdf.text("KPI Dashboard", PAGE_WIDTH / 2, MARGIN + 7, { align: "center" });
  pdf.setDrawColor(200, 200, 200);
  pdf.line(MARGIN, MARGIN + HEADING_HEIGHT - 2, PAGE_WIDTH - MARGIN, MARGIN + HEADING_HEIGHT - 2);

  const scale = Math.min(CONTENT_WIDTH / canvas.width, CONTENT_HEIGHT / canvas.height);
  const finalWidth = canvas.width * scale;
  const finalHeight = canvas.height * scale;
  const xOffset = MARGIN + (CONTENT_WIDTH - finalWidth) / 2;
  const yOffset = MARGIN + HEADING_HEIGHT + (CONTENT_HEIGHT - finalHeight) / 2;

  pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", xOffset, yOffset, finalWidth, finalHeight);
  pdf.save(`Dashboard-Report-${new Date().toISOString().split("T")[0]}.pdf`);
}