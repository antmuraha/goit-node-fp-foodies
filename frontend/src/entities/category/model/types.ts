export type CategorySummary = {
  id: number;
  name: string;
  description: string;
  image?: string;
};

export type CategoryListResponse = CategorySummary[];
