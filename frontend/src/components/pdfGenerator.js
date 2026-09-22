import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF(invoice, business = {}) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  // =========================
  // BUSINESS DETAILS
  // =========================

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  doc.text(
    business.businessName ||
      "Ultrakey IT Solutions Private Limited",
    20,
    20
  );

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  if (business.address) {
    doc.text(business.address, 20, 27);
  }

  if (business.website) {
    doc.text(business.website, 20, 33);
  }

  // =========================
  // INVOICE TITLE
  // =========================

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  doc.text(
    "INVOICE",
    pageWidth - 65,
    20
  );

  // =========================
  // INVOICE DETAILS
  // =========================

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Invoice No: ${invoice.invoice_number || ""}`,
    pageWidth - 80,
    32
  );

  doc.text(
    `Date: ${invoice.created_date || ""}`,
    pageWidth - 80,
    39
  );

  if (invoice.due_date) {
    doc.text(
      `Due Date: ${invoice.due_date}`,
      pageWidth - 80,
      46
    );
  }

  // =========================
  // LINE
  // =========================

  doc.line(
    20,
    55,
    pageWidth - 20,
    55
  );

  // =========================
  // CLIENT
  // =========================

  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 20, 68);

  doc.setFont("helvetica", "normal");

  doc.text(
    invoice.client_name || "Client",
    20,
    76
  );

  if (invoice.client_email) {
    doc.text(
      invoice.client_email,
      20,
      83
    );
  }

  if (invoice.client_address) {
    doc.text(
      invoice.client_address,
      20,
      90
    );
  }

  // =========================
  // ITEMS
  // =========================

  const items = invoice.items || [];

  const rows = items.map((item) => [
    item.item_title || "",
    item.quantity || 0,
    Number(item.rate || 0).toFixed(2),
    Number(item.amount || 0).toFixed(2),
  ]);

  autoTable(doc, {
    startY: 100,

    head: [
      ["Service", "Qty", "Rate", "Amount"],
    ],

    body: rows,

    theme: "grid",

    styles: {
      fontSize: 9,
      cellPadding: 4,
    },

    headStyles: {
      fontStyle: "bold",
    },
  });

  // =========================
  // CALCULATIONS
  // =========================

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  const discount =
    Number(invoice.discount || 0);

  const tax =
    Number(invoice.tax || 0);

  const total =
    subtotal - discount + tax;

  // =========================
  // TOTALS
  // =========================

  let finalY =
    doc.lastAutoTable.finalY + 12;

  doc.setFontSize(10);

  doc.text(
    `Subtotal: ${subtotal.toFixed(2)}`,
    pageWidth - 80,
    finalY
  );

  finalY += 7;

  doc.text(
    `Discount: ${discount.toFixed(2)}`,
    pageWidth - 80,
    finalY
  );

  finalY += 7;

  doc.text(
    `Tax: ${tax.toFixed(2)}`,
    pageWidth - 80,
    finalY
  );

  finalY += 10;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");

  doc.text(
    `Total Due: ${total.toFixed(2)}`,
    pageWidth - 80,
    finalY
  );

  // =========================
  // NOTES
  // =========================

  if (invoice.notes) {
    finalY += 18;

    doc.setFontSize(10);

    doc.text(
      "Notes:",
      20,
      finalY
    );

    doc.setFont("helvetica", "normal");

    const noteLines =
      doc.splitTextToSize(
        invoice.notes,
        pageWidth - 40
      );

    doc.text(
      noteLines,
      20,
      finalY + 7
    );
  }

  // =========================
  // FOOTER
  // =========================

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Thank you for your business.",
    pageWidth / 2,
    285,
    {
      align: "center",
    }
  );

  // =========================
  // DOWNLOAD
  // =========================

  doc.save(
    `${invoice.invoice_number || "invoice"}.pdf`
  );
}