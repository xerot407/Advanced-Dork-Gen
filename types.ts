export interface Dork {
  query: string;
  description: string;
  category: string;
  intent: 'Offensive' | 'Defensive' | 'Hybrid';
}

export interface DorkCategoryResult {
  categoryName: string;
  dorks: Dork[];
}

export enum DorkCategory {
  INDEX = "Index Dorks",
  DIRECTORY = "Directory Listings",
  LOGIN = "Login Pages",
  SQL = "SQL Errors & Vulns",
  SENSITIVE = "Sensitive Files",
  ADMIN = "Admin Panels",
  BACKUP = "Backup & Configs",
  DEVICES = "IoT & Dashboards",
  CODE = "Code & Credentials",
  CLOUD = "Cloud Buckets",
  PARAMETERS = "Parameter Exploits",
  TECH = "Tech/Framework Specific",
  CUSTOM = "Advanced Custom",
}

export enum SearchPlatform {
  GOOGLE = "Google",
  BING = "Bing",
  DUCKDUCKGO = "DuckDuckGo",
  SHODAN = "Shodan",
  GITHUB = "GitHub",
  CENSYS = "Censys"
}

export const ALL_CATEGORIES = [
  DorkCategory.INDEX,
  DorkCategory.DIRECTORY,
  DorkCategory.LOGIN,
  DorkCategory.SQL,
  DorkCategory.SENSITIVE,
  DorkCategory.ADMIN,
  DorkCategory.BACKUP,
  DorkCategory.DEVICES,
  DorkCategory.CODE,
  DorkCategory.CLOUD,
  DorkCategory.PARAMETERS,
  DorkCategory.TECH,
  DorkCategory.CUSTOM,
];

export interface GenerateDorksRequest {
  target: string;
  selectedCategories: DorkCategory[];
  platform: SearchPlatform;
}