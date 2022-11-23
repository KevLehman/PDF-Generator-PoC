## PoC - Programatic PDF Generation

### PoC 1 - PDFKit

Generates a PDF with multiple pages, images, margin and custom styles using PDFKit API.
The running will create a custom PDF with the following content:
1. A title
2. A "header" section with metadata
3. A body section with a list of messages, containing images and text (short and long)
4. Custom styles (background color, message boxes, etc.)

```
npm install
npx tsc && node ./pdf-pdfkit.js
```

#### What works
1. Multiple pages
2. Images
3. Margin
4. Custom styles
5. Automatic page breaking

### PoC 2 - ReactPDF/renderer
Generates a multi-page PDF with images, margin and custom styles using ReactPDF/renderer API.
1. A title
2. A "header" section with metadata
3. A body section with a list of messages, containing images and text (short and long)
4. Custom styles (background color, message boxes, etc.)

```
npm install
npx tsc && node ./pdf-reactpdf.js
```