import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../models/article.model';

/**
 * Service to interact with the backend API
 */
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly apiUrl = 'http://localhost:3000/api/articles';

  constructor(private http: HttpClient) {}

  /**
   * Search articles with pagination
   * @param query Search query string
   * @param page Page number (1-based)
   * @param pageSize Number of results per page
   * @returns Observable with API response
   */
  searchArticles(query: string, page: number, pageSize: number): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/search`, { params })
      .pipe(
        map(response => this.validateResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Get DOI URL for article
   * @param doi Article DOI
   * @returns Full URL to article
   */
  getArticleUrl(doi: string): string {
    return `https://doi.org/${doi}`;
  }

  /**
   * Validate API response structure
   */
  private validateResponse(response: ApiResponse): ApiResponse {
    if (!response.success) {
      throw new Error(response.error || 'API request failed');
    }
    return response;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while fetching articles';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = `Server Error (${error.status}): ${error.message}`;
    }
    
    console.error('ArticleService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
