export type TestimonialSummary = {
  id: number;
  userId: number;
  content: string;
  rating: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
};

export type TestimonialListResponse = {
  data: TestimonialSummary[];
  page: number;
  limit: number;
};
