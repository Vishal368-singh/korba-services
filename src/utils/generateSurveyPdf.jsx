import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";

import SurveyReportTemplate from "../pages/SurveyPreview/components/SurveyReportTemplate";

/* =========================================================
   HELPERS
========================================================= */

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitForImages = async (container) => {
  const images = container.querySelectorAll("img");

  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }

          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );
};

/* =========================================================
   GENERATE SURVEY PDF
========================================================= */

export async function generateSurveyPdf(survey) {
  if (!survey) {
    throw new Error("Survey data is missing");
  }

  const container = document.createElement("div");

  Object.assign(container.style, {
    position: "absolute",
    left: "-10000px",
    top: "0",
    width: "204mm",
    margin: "0",
    padding: "0",
    background: "#ffffff",
    boxSizing: "border-box",
    overflow: "visible",
    zIndex: "-1",
  });

  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(<SurveyReportTemplate survey={survey} />);

  try {
    /* -------------------------------------------------------
       WAIT FOR REACT
    ------------------------------------------------------- */

    await wait(500);

    /* -------------------------------------------------------
       WAIT FOR FONTS
    ------------------------------------------------------- */

    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Continue even if font loading fails.
      }
    }

    /* -------------------------------------------------------
       WAIT FOR IMAGES
    ------------------------------------------------------- */

    await waitForImages(container);
    await wait(300);

    /* -------------------------------------------------------
       REPORT ELEMENT
    ------------------------------------------------------- */

    const report = container.querySelector("#survey-report");

    if (!report) {
      throw new Error("Survey report element not found");
    }

    /* -------------------------------------------------------
       FORCE LAYOUT CALCULATION
    ------------------------------------------------------- */

    const reportWidth = report.scrollWidth;
    const reportHeight = report.scrollHeight;

    if (!reportWidth || !reportHeight) {
      throw new Error("Unable to determine report dimensions");
    }

    /* -------------------------------------------------------
       CANVAS
    ------------------------------------------------------- */

    const canvas = await html2canvas(report, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      width: reportWidth,
      height: reportHeight,
      windowWidth: reportWidth,
      windowHeight: reportHeight,
    });

    /* -------------------------------------------------------
       A4
    ------------------------------------------------------- */

    const A4_WIDTH = 210;
    const A4_HEIGHT = 297;

    const MARGIN_X = 4;
    const MARGIN_Y = 4;

    const availableWidth = A4_WIDTH - MARGIN_X * 2;
    const availableHeight = A4_HEIGHT - MARGIN_Y * 2;

    const canvasRatio = canvas.height / canvas.width;

    /*
     * Start with the full available A4 width.
     * Only scale down when the content actually
     * exceeds the available A4 height.
     */
    let pdfWidth = availableWidth;
    let pdfHeight = pdfWidth * canvasRatio;

    if (pdfHeight > availableHeight) {
      const scale = availableHeight / pdfHeight;

      pdfWidth *= scale;
      pdfHeight *= scale;
    }

    const x = (A4_WIDTH - pdfWidth) / 2;
    const y = MARGIN_Y;

    /* -------------------------------------------------------
       PDF
    ------------------------------------------------------- */

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imageData = canvas.toDataURL("image/jpeg", 0.96);

    pdf.addImage(
      imageData,
      "JPEG",
      x,
      y,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );

    /* -------------------------------------------------------
       FILE NAME
    ------------------------------------------------------- */

    const surveyId =
      survey?.survey_information?.survey_id ||
      survey?.survey_information?.property_id ||
      "survey-report";

    const safeSurveyId = String(surveyId).replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

    pdf.save(`survey-report-${safeSurveyId}.pdf`);
  } finally {
    root.unmount();
    container.remove();
  }
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default generateSurveyPdf;