import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";

import SurveyReportTemplate from "../pages/SurveyPreview/components/SurveyReportTemplate";


/* =========================================================
   WAIT
========================================================= */

const wait = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );


/* =========================================================
   WAIT FOR IMAGES
========================================================= */

const waitForImages = async (
  container
) => {
  const images =
    container.querySelectorAll("img");

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

export async function generateSurveyPdf(
  survey
) {
  if (!survey) {
    throw new Error(
      "Survey data is missing"
    );
  }


  /* =======================================================
     CREATE OFFSCREEN CONTAINER
  ======================================================= */

  const container =
    document.createElement("div");

  Object.assign(
    container.style,
    {
      position: "absolute",

      left: "-10000px",

      top: "0",

      width: "202mm",

      margin: "0",

      padding: "0",

      background: "#ffffff",

      boxSizing: "border-box",

      overflow: "visible",

      zIndex: "-1",
    }
  );


  document.body.appendChild(
    container
  );


  /* =======================================================
     RENDER REACT REPORT
  ======================================================= */

  const root =
    createRoot(container);


  root.render(
    <SurveyReportTemplate
      survey={survey}
    />
  );


  /* =======================================================
     WAIT FOR REACT RENDER
  ======================================================= */

  await wait(500);


  /* =======================================================
     WAIT FOR FONTS
  ======================================================= */

  if (
    document.fonts &&
    document.fonts.ready
  ) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font loading errors
    }
  }


  /* =======================================================
     WAIT FOR IMAGES
  ======================================================= */

  await waitForImages(
    container
  );


  /* =======================================================
     EXTRA WAIT FOR IMAGE LAYOUT
  ======================================================= */

  await wait(300);


  /* =======================================================
     FIND REPORT
  ======================================================= */

  const report =
    container.querySelector(
      "#survey-report"
    );


  if (!report) {
    root.unmount();

    container.remove();

    throw new Error(
      "Survey report element not found"
    );
  }


  /* =======================================================
     GET ACTUAL REPORT SIZE
  ======================================================= */

  const reportWidth =
    report.scrollWidth;

  const reportHeight =
    report.scrollHeight;


  if (
    !reportWidth ||
    !reportHeight
  ) {
    root.unmount();

    container.remove();

    throw new Error(
      "Unable to determine report dimensions"
    );
  }


  /* =======================================================
     HTML2CANVAS
  ======================================================= */

  let canvas;

  try {
    canvas =
      await html2canvas(
        report,
        {
          scale: 2,

          useCORS: true,

          allowTaint: false,

          backgroundColor:
            "#ffffff",

          logging: false,

          imageTimeout: 15000,

          scrollX: 0,

          scrollY: 0,

          width:
            reportWidth,

          height:
            reportHeight,

          windowWidth:
            reportWidth,

          windowHeight:
            reportHeight,
        }
      );
  } catch (error) {
    root.unmount();

    container.remove();

    throw error;
  }


  /* =======================================================
     CREATE A4 PDF
  ======================================================= */

  const pdf =
    new jsPDF({
      orientation:
        "portrait",

      unit: "mm",

      format: "a4",

      compress: true,
    });


  /* =======================================================
     A4 DIMENSIONS
  ======================================================= */

  const A4_WIDTH = 210;

  const A4_HEIGHT = 297;


  /* =======================================================
     PDF MARGINS
  ======================================================= */

  const MARGIN_X = 4;

  const MARGIN_Y = 4;


  const availableWidth =
    A4_WIDTH -
    MARGIN_X * 2;

  const availableHeight =
    A4_HEIGHT -
    MARGIN_Y * 2;


  /* =======================================================
     CANVAS RATIO
  ======================================================= */

  const canvasRatio =
    canvas.height /
    canvas.width;


  /* =======================================================
     FIT REPORT TO A4
  ======================================================= */

  let pdfWidth =
    availableWidth;

  let pdfHeight =
    pdfWidth *
    canvasRatio;


  /*
    If report is taller than
    available A4 height,
    scale it down.
  */

  if (
    pdfHeight >
    availableHeight
  ) {
    pdfHeight =
      availableHeight;

    pdfWidth =
      pdfHeight /
      canvasRatio;
  }


  /* =======================================================
     CENTER HORIZONTALLY
  ======================================================= */

  const x =
    (A4_WIDTH -
      pdfWidth) /
    2;


  const y =
    MARGIN_Y;


  /* =======================================================
     CANVAS → IMAGE
  ======================================================= */

  const imageData =
    canvas.toDataURL(
      "image/jpeg",
      0.96
    );


  /* =======================================================
     ADD IMAGE TO PDF
  ======================================================= */

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


  /* =======================================================
     FILE NAME
  ======================================================= */

  const surveyId =
    survey
      ?.survey_information
      ?.survey_id ||
    survey
      ?.survey_information
      ?.property_id ||
    "survey-report";


  const safeSurveyId =
    String(surveyId)
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );


  /* =======================================================
     SAVE PDF
  ======================================================= */

  pdf.save(
    `survey-report-${safeSurveyId}.pdf`
  );


  /* =======================================================
     CLEANUP
  ======================================================= */

  root.unmount();

  container.remove();
}


/* =========================================================
   DEFAULT EXPORT
=========================================================

   This also allows:

   import generateSurveyPdf from "...";

   in addition to:

   import {
     generateSurveyPdf
   } from "...";
========================================================= */

export default generateSurveyPdf;