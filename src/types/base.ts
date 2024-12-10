export interface BaseEntity {
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}