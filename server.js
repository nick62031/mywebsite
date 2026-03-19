const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

// upload folder
const upload = multer({ dest: "uploads/" });

// API for merging PDFs
app.post("/merge", upload.array("files"), async (req, res) => {
    try {
        const mergedPdf = await PDFDocument.create();

        for (let file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdf = await PDFDocument.load(pdfBytes);

            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
        }

        const finalPdf = await mergedPdf.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
        res.send(finalPdf);

    } catch (err) {
        console.log(err);
        res.send("Error merging PDFs");
    }
});

// start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
