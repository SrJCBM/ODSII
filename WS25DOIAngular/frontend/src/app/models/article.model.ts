export interface Article {
  doi: string;
  title: string;
  journal: string;
  publicationDate: string;
  authors: string[];
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: PaginationInfo;
}

export interface ApiResponse {
  success: boolean;
  data: ArticlesResponse;
  error?: string;
}
