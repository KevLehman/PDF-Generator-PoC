import * as fs from "fs";
import PDFDoc from "pdfkit";
import { messages } from "./messages";
import { measurePerformance } from "./performance";

const imageDefaults = {
  width: 200,
  height: 200,
};

function createPDF() {
  const doc = new PDFDoc({ margin: 50, size: "A4", displayTitle: true });

  // events
  doc.on("pageAdded", () => {
    doc
      .rect(0, 0, doc.page.width, doc.page.height)
      .fill("#F7F8FA")
      .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
      .fill("#ffffff")
      .fill("#000000");

    // Set Y position to 60 so lines start being parsed from here
    // Otherwise, first line will start from margin, which is 50
    doc.y = 60;
  });

  addInfo(doc);
  createHeader(doc);
  createMessages(doc);

  doc.pipe(fs.createWriteStream(`output${Date.now()}.pdf`));
  doc.end();
}

function addInfo(doc: PDFKit.PDFDocument) {
  // Useful PDF information. Metadata mostly
  doc.info = {
    Title: "Your chat transcript",
    Author: "Rocket.Chat",
    Keywords: "Chat transcript",
  };
}

function createHeader(doc: PDFKit.PDFDocument) {
  // This creates the background color of the document. Should be the first thing created, otherwise, will cover everything
  // Since first page creation doesn't trigger pageAdded event, we need to create it here manually
  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#F7F8FA");
  // This should add the image as a logo along with the company name.
  doc
    .image("logo.png", 50, 45, { width: 40 })
    .fillColor("#444444")
    .fontSize(20)
    // text("actual text", position x, position y)
    .text("Rocket.Chat", 110, 57);

  doc.fontSize(15).text("Chat transcript", 50, 100);

  doc
    .fontSize(10)
    // bold text = stroke
    .text("Agent: ", 50, 130, { stroke: true, continued: true })
    .text("Christian Castro", { stroke: false})

    .text("Customer: ", 50, 145, { stroke: true, continued: true })
    .text("Juanito Verdulero De Ponce", { stroke: false })

    .text("Date: ", 300, 130, { stroke: true, continued: true })
    .text("Nov 21, 2022", { stroke: false })

    .text("Time: ", 300, 145, { stroke: true, continued: true })
    .text("11:00 AM", { stroke: false })
    .moveDown();
}

function createMessages(doc: PDFKit.PDFDocument) {
  // dynamic sizing :(
  doc
    .rect(50, 200, doc.page.width - 100, doc.page.height - 225)
    .fill("#ffffff");
  doc.y = 210;
  // Add 1000 lines to pdf
  messages.map((message, index) => {
    // check if fits on screen
    // Check message fits on whitebox
    if (doc.y > doc.page.height - 50) {
      // adds new page when first line doesnt fit
      console.log("Message doesnt fit, adding new page");
      doc.addPage();
    }
    // what if the message is too long? and the 3 items or images don't fit properly?
    // check if full message fits on screen
    // First: check height of message header (name + ts)
    // For some reason, to do this, we need the width of the message :confused-cat:
    const headerString = `${message.user} - ${message.ts}`;
    const headerWidth = doc.widthOfString(headerString);
    const headerHeight = doc.heightOfString(headerString, {
      width: headerWidth,
    });

    // Second: check height of message body
    const messageWidth = doc.widthOfString(message.msg);
    const messageHeight = doc.heightOfString(message.msg, {
      width: messageWidth,
    });

    // Third check if images can fit on the page. Since we want full messages rendered altogether, we need to check if the images fit on the page along the text
    // Good part: we know the height of images so we can just add it to the message height and be happy
    const hasAttachments =
      message.attachments && message.attachments.length > 0;
    const totalHeight =
      headerHeight +
      messageHeight +
      (hasAttachments ? imageDefaults.height + 10 + headerHeight : 0);

    // So, if Y + height of the message (including attachments) is greater than the page height, we need to add a new page and render everything there
    if (doc.y + totalHeight > doc.page.height - 50) {
      // adds new page when first line doesnt fit
      // Create "preparePage" function to add colors and bounding white box
      console.log("Full message doesnt fit, adding new page");
      doc.addPage();
    }

    doc
      .text(message.user, 60, doc.y, { stroke: true, continued: true })
      .fillColor("#6C727A")
      .text(' ' + message.ts, { stroke: false })
      .fillColor("#000000")
      .moveDown();

    doc
      .text(message.msg, {
        width: doc.page.width - 120,
        align: "justify",
        lineBreak: true,
      })
      .moveDown();

    if (hasAttachments) {
      // Attachment header
      doc
        .fillColor("#6C727A")
        .fontSize(8)
        .text(message.attachments[0].name, 60, doc.y);

      // For PoC we're falling back to use the first attachment and use fs to read the file. The limitation is that PDFKit only supports buffer images, so we need to read the file and convert it to a buffer
      doc.image(fs.readFileSync(message.attachments[0].url), 60, doc.y, {
        height: imageDefaults.height,
      });
      // Reset font size and add an emtpy line to separate messages
      doc.fontSize(10);
      doc.text(" ");
    }
  });
}

const cpuUsage = process.cpuUsage();

function create100PDFs() {
  const promises = [];
  // Change this if you want more PDFs :)
  for (let i = 0; i < 1; i++) {
    promises.push(createPDF());
  }

  return Promise.all(promises);
}

create100PDFs().then(() => {
  measurePerformance(cpuUsage);
});
