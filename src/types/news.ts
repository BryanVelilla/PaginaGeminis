export type NewsCategory = 
  | 'all' 
  | 'cybersecurity' 
  | 'vulnerability' 
  | 'networking' 
  | 'threat-intel' 
  | 'advisory';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceUrl?: string;
  category: NewsCategory;
  categoryLabel: string;
  pubDate: string; // ISO string
  timestamp: number; // Unix timestamp en ms para ordenar
  author?: string;
  badge?: string;
}

export interface NewsFeedData {
  lastUpdated: string; // ISO string de la última sincronización
  totalItems: number;
  sources: string[];
  items: NewsItem[];
}
