declare module 'jspdf-autotable' {
  import jsPDF from 'jspdf';
  
  export interface UserOptions {
    head?: any[][];
    body?: any[][];
    startY?: number;
    styles?: any;
    headStyles?: any;
    columnStyles?: any;
    margin?: { left?: number; right?: number; top?: number; bottom?: number };
  }
  
  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
