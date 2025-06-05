export class DocumentExportService {
  static async exportToWord(content: string, filename: string): Promise<void> {
    try {
      // Convert markdown to HTML first
      const htmlContent = this.markdownToHtml(content)

      // Create a Word-compatible HTML document
      const wordDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            body { 
              font-family: 'Calibri', sans-serif; 
              line-height: 1.6; 
              margin: 1in; 
              color: #333;
            }
            h1 { 
              color: #2563eb; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 10px;
              font-size: 24px;
            }
            h2 { 
              color: #1e40af; 
              margin-top: 30px;
              font-size: 20px;
            }
            h3 { 
              color: #1e3a8a; 
              margin-top: 20px;
              font-size: 16px;
            }
            ul, ol { 
              margin-left: 20px; 
            }
            li { 
              margin-bottom: 5px; 
            }
            .highlight { 
              background-color: #fef3c7; 
              padding: 2px 4px; 
            }
            .section { 
              margin-bottom: 30px; 
            }
            .score { 
              font-weight: bold; 
              color: #059669; 
            }
            .recommendation { 
              background-color: #f0f9ff; 
              padding: 15px; 
              border-left: 4px solid #2563eb; 
              margin: 10px 0; 
            }
            .template { 
              background-color: #f9fafb; 
              padding: 10px; 
              border: 1px solid #d1d5db; 
              font-style: italic; 
              margin: 10px 0; 
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `

      // Create blob and download
      const blob = new Blob([wordDocument], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      this.downloadFile(blob, `${filename}.doc`)
    } catch (error) {
      console.error("Error exporting to Word:", error)
      throw new Error("Failed to export document")
    }
  }

  static async exportToPDF(content: string, filename: string): Promise<void> {
    try {
      // For PDF export, we'll use the browser's print functionality
      // Create a new window with the formatted content
      const htmlContent = this.markdownToHtml(content)

      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups for PDF export.")
      }

      const pdfDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              margin: 20px; 
              color: #333;
              font-size: 12px;
            }
            h1 { 
              color: #2563eb; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 10px;
              font-size: 18px;
              page-break-after: avoid;
            }
            h2 { 
              color: #1e40af; 
              margin-top: 25px;
              font-size: 16px;
              page-break-after: avoid;
            }
            h3 { 
              color: #1e3a8a; 
              margin-top: 20px;
              font-size: 14px;
              page-break-after: avoid;
            }
            ul, ol { 
              margin-left: 15px; 
            }
            li { 
              margin-bottom: 3px; 
            }
            .section { 
              margin-bottom: 25px; 
              page-break-inside: avoid;
            }
            .score { 
              font-weight: bold; 
              color: #059669; 
            }
            .recommendation { 
              background-color: #f0f9ff; 
              padding: 10px; 
              border-left: 3px solid #2563eb; 
              margin: 8px 0; 
              page-break-inside: avoid;
            }
            .template { 
              background-color: #f9fafb; 
              padding: 8px; 
              border: 1px solid #d1d5db; 
              font-style: italic; 
              margin: 8px 0; 
              page-break-inside: avoid;
            }
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #2563eb;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            }
            .print-button:hover {
              background: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">Print/Save as PDF</button>
          ${htmlContent}
          <script>
            // Auto-trigger print dialog after a short delay
            setTimeout(() => {
              window.print();
            }, 1000);
          </script>
        </body>
        </html>
      `

      printWindow.document.write(pdfDocument)
      printWindow.document.close()
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      throw new Error("Failed to export PDF")
    }
  }

  private static markdownToHtml(markdown: string): string {
    // Simple markdown to HTML converter
    const html = markdown
      // Headers
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Lists
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      // Wrap in paragraphs
      .replace(/^(?!<[hul])/gm, "<p>")
      .replace(/(?<!>)$/gm, "</p>")
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, "")
      .replace(/<p>(<[hul])/g, "$1")
      .replace(/(<\/[hul]>)<\/p>/g, "$1")

    return html
  }

  private static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
