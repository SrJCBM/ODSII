import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Article } from '../models/article.model';

/**
 * Service to handle PDF export functionality
 */
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  /**
   * Export articles to PDF
   * @param articles Array of articles to export
   * @param query Search query used
   */
  exportToPdf(articles: Article[], query: string): void {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('PLOS Articles Search Results', 14, 20);
    
    // Add query info
    doc.setFontSize(12);
    doc.text(`Search Query: ${query}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);
    
    // Prepare table data
    const tableData = articles.map(article => [
      this.truncateText(article.title, 50),
      this.truncateText(article.journal, 30),
      article.publicationDate,
      this.truncateText(article.doi, 40)
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Title', 'Journal', 'Publication Date', 'DOI']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 45 },
        2: { cellWidth: 30 },
        3: { cellWidth: 45 }
      },
      margin: { left: 14, right: 14 }
    });
    
    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save PDF
    const fileName = `plos-articles-${Date.now()}.pdf`;
    doc.save(fileName);
  }

  /**
   * Truncate text to specified length
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
