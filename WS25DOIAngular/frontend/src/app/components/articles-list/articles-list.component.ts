import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { PdfService } from '../../services/pdf.service';
import { Article, PaginationInfo } from '../../models/article.model';

/**
 * Main component for articles search and display
 */
@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  articles: Article[] = [];
  pagination: PaginationInfo | null = null;
  searchQuery: string = 'title:university';
  isLoading: boolean = false;
  errorMessage: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private articleService: ArticleService,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  /**
   * Load articles from API
   */
  loadArticles(): void {
    console.log('loadArticles called');
    this.isLoading = true;
    this.errorMessage = '';

    this.articleService.searchArticles(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('Response received:', response);
          this.articles = response.data.articles;
          this.pagination = response.data.pagination;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error received:', error);
          this.errorMessage = error.message;
          this.isLoading = false;
          this.articles = [];
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Handle search form submission
   */
  onSearch(): void {
    this.currentPage = 1;
    this.loadArticles();
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    if (page < 1 || (this.pagination && page > this.pagination.totalPages)) {
      return;
    }
    this.currentPage = page;
    this.loadArticles();
  }

  /**
   * Get page numbers for pagination display
   */
  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.currentPage;
    const pages: number[] = [];
    
    // Show max 7 page numbers
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 3);
    
    // Adjust if near start or end
    if (currentPage <= 4) {
      endPage = Math.min(7, totalPages);
    }
    if (currentPage > totalPages - 4) {
      startPage = Math.max(1, totalPages - 6);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  /**
   * Handle DOI double click - open article URL
   */
  onDoiDoubleClick(doi: string): void {
    const url = this.articleService.getArticleUrl(doi);
    window.open(url, '_blank');
  }

  /**
   * Export current articles to PDF
   */
  exportToPdf(): void {
    if (this.articles.length === 0) {
      alert('No articles to export');
      return;
    }
    this.pdfService.exportToPdf(this.articles, this.searchQuery);
  }

  /**
   * Format authors for display
   */
  formatAuthors(authors: string[]): string {
    if (!authors || authors.length === 0) return 'N/A';
    return authors.slice(0, 3).join(', ') + (authors.length > 3 ? '...' : '');
  }

  /**
   * Get minimum value between two numbers
   */
  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
}
