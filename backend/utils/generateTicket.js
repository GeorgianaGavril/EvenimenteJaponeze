// services/pdfService.js
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const path = require("path");

const generateTicketPDF = async (
  bilete,
  recipientEmail,
  eventObj,
  timestamp,
  sessionId
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        titlu: eventTitle,
        data: eventDate,
        salaId,
        pretStandard,
        pretLoja,
        pretVIP,
      } = eventObj;

      const doc = new PDFDocument({ margin: 0, size: "A4" });

      doc.registerFont(
        "Roboto",
        path.join(__dirname, "../fonts/Roboto-Regular.ttf")
      );
      doc.registerFont(
        "Roboto-Italic",
        path.join(__dirname, "../fonts/Roboto-Italic.ttf")
      );
      doc.registerFont(
        "Roboto-Bold",
        path.join(__dirname, "../fonts/Roboto-Bold.ttf")
      );

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      for (let i = 0; i < bilete.length; i++) {
        const b = bilete[i];
        let price = 0;
        switch (b.categorie) {
          case "VIP":
            price = pretVIP;
            break;
          case "standard":
            price = pretStandard;
            break;
          case "loja":
            price = pretLoja;
            break;
        }

        doc.rect(0, 0, doc.page.width, 120).fill("#8c4b7c");

        doc
          .fillColor("white")
          .font("Roboto-Bold")
          .fontSize(28)
          .text("Sakura Stage", 0, 35, { align: "center" });

        doc
          .font("Roboto")
          .fontSize(12)
          .text("www.sakurastage.ro", 0, 75, { align: "center" });

        const formattedEventDate = eventDate
          ? new Date(eventDate).toLocaleString("ro-RO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Data necunoscută";

        doc.moveDown(4).fillColor("black");
        doc.font("Roboto-Bold").fontSize(20).text(eventTitle, 50, 140);
        doc.moveDown(0.5);
        doc
          .font("Roboto")
          .fontSize(14)
          .text(`Data & ora: ${formattedEventDate}`, 50);
        doc.font("Roboto").fontSize(14).text(`${salaId}`, 50);

        const boxX = 50;
        const boxY = 240;
        const boxWidth = doc.page.width - 100;
        const boxHeight = 140;
        doc
          .save()
          .rect(boxX, boxY, boxWidth, boxHeight)
          .lineWidth(1)
          .stroke("#763932");
        doc.restore();

        doc
          .font("Roboto-Bold")
          .fontSize(16)
          .fillColor("#4f0a01")
          .text(`Bilet #${i + 1}`, boxX + 15, boxY + 15);

        doc.moveDown(0.5);
        doc
          .font("Roboto")
          .fontSize(14)
          .fillColor("black")
          .text(
            `Categorie: ${b.categorie.toUpperCase()}`,
            boxX + 15,
            boxY + 45
          );

        const randText = b.rand.startsWith("R")
          ? `Rand ${b.rand.slice(1)}`
          : `Loja ${b.rand.slice(4)}`;
        doc
          .font("Roboto")
          .text(`Loc: ${randText}, Scaun: ${b.scaun}`, boxX + 15, boxY + 70);
        doc
          .font("Roboto")
          .text(`Preț: ${price.toFixed(2)} RON`, boxX + 15, boxY + 95);

        const qrContent = `https://sakurastage.ro/verify/${encodeURIComponent(
          recipientEmail
        )}/ticket-${i + 1}`;
        const qrDataUrl = await QRCode.toDataURL(qrContent);
        const qrImageSize = 100;
        doc.image(
          qrDataUrl,
          boxX + boxWidth - qrImageSize - 15,
          boxY + boxHeight - qrImageSize - 15,
          {
            fit: [qrImageSize, qrImageSize],
            align: "right",
            valign: "bottom",
          }
        );

        const footerY = 420;
        doc
          .font("Roboto-Italic")
          .fontSize(10)
          .fillColor("#dbb8d2")
          .text(
            `Comanda efectuată la: ${timestamp.toLocaleString("ro-RO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            50,
            footerY
          );
        doc
          .font("Roboto-Italic")
          .text(`Număr comandă: ${sessionId || "N/A"}`, 50, footerY + 15);

        if (i < bilete.length - 1) {
          doc.addPage();
        }
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateTicketPDF };
