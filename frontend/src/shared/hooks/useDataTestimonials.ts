import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchTestimonials } from "../../store/slices/testimonialsSlice";

export const useDataTestimonials = () => {
  const dispatch = useAppDispatch();
  const testimonials = useAppSelector((state) => state.testimonials.list);
  const status = useAppSelector((state) => state.testimonials.listStatus);
  const error = useAppSelector((state) => state.testimonials.listError);

  const loadTestimonials = useCallback(() => {
    void dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      loadTestimonials();
    }
  }, [loadTestimonials, status]);

  return {
    testimonials,
    isLoading: status === "loading",
    error,
    loadTestimonials,
  };
};
