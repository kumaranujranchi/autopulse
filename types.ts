export enum NewsCategory {
  ALL = 'All News',
  CARS = 'Cars',
  BIKES = 'Bikes',
  EVS = 'Electric Vehicles',
  REVIEWS = 'Reviews',
  INDUSTRY = 'Industry'
}

export interface Article {
  id: string;
  headline: string;
  summary: string;
  category: string;
  author: string;
  publishedTime: string;
  imageSeed?: number; // Used to generate consistent placeholder images
}

export interface SearchResult {
  text: string;
  sources: {
    title: string;
    uri: string;
  }[];
}
