import jsPDF from "jspdf";

interface FaqItem {
  question: string;
  answer: string;
  link?: { url: string; label: string };
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

export const generateFaqPDF = (sections: FaqSection[]) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const PRIMARY = "#114a67";
  const LIGHT_BG = "#E6F1F8";

  const checkPageBreak = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setTextColor(PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.text("FAQ – QualiRénovation", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(11);
  doc.setTextColor("#666666");
  doc.setFont("helvetica", "normal");
  doc.text("Entreprise de rénovation – Maître d'œuvre – Suivi de chantier", pageWidth / 2, y, { align: "center" });
  y += 15;

  sections.forEach((section) => {
    checkPageBreak(20);

    // Section title badge
    doc.setFillColor(PRIMARY);
    doc.roundedRect(margin, y - 5, contentWidth, 10, 2, 2, "F");
    doc.setFontSize(13);
    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin + 4, y + 1.5);
    y += 12;

    section.items.forEach((item) => {
      checkPageBreak(25);

      // Question
      doc.setFontSize(11);
      doc.setTextColor(PRIMARY);
      doc.setFont("helvetica", "bold");
      const questionLines = doc.splitTextToSize(item.question, contentWidth - 4);
      doc.text(questionLines, margin + 2, y);
      y += questionLines.length * 5 + 2;

      // Answer
      doc.setFontSize(10);
      doc.setTextColor("#333333");
      doc.setFont("helvetica", "normal");

      // Clean answer text
      const cleanAnswer = item.answer
        .replace(/🍾/g, "")
        .replace(/<[^>]*>/g, "")
        .trim();

      const answerLines = doc.splitTextToSize(cleanAnswer, contentWidth - 8);

      // Light background for answer
      const answerHeight = answerLines.length * 4.5 + 4;
      checkPageBreak(answerHeight);
      doc.setFillColor(LIGHT_BG);
      doc.roundedRect(margin + 2, y - 2, contentWidth - 4, answerHeight, 1, 1, "F");
      doc.text(answerLines, margin + 5, y + 2);
      y += answerHeight + 2;

      // Link if present
      if (item.link) {
        checkPageBreak(8);
        doc.setTextColor("#B8860B");
        doc.setFont("helvetica", "italic");
        doc.textWithLink(item.link.label, margin + 5, y, { url: item.link.url });
        y += 6;
      }

      y += 4;
    });

    y += 6;
  });

  // Footer
  checkPageBreak(25);
  y += 5;
  doc.setDrawColor(PRIMARY);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor("#666666");
  doc.setFont("helvetica", "italic");
  const conclusion = [
    "Rénover, ce n'est pas seulement transformer un espace.",
    "C'est assumer des choix, une méthode et une responsabilité.",
    "",
    "Un chantier réussi n'est pas celui qui impressionne le jour J,",
    "mais celui qui reste juste, solide et serein dans le temps.",
  ];
  conclusion.forEach((line) => {
    doc.text(line, pageWidth / 2, y, { align: "center" });
    y += 5;
  });

  doc.save("FAQ-QualiRenovation.pdf");
};
