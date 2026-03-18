import { useCallback, useEffect } from "react";
import { fetchAreas } from "../../store/slices/areasSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataAreas = () => {
  const dispatch = useAppDispatch();
  const areas = useAppSelector((state) => state.areas.list);
  const status = useAppSelector((state) => state.areas.listStatus);
  const error = useAppSelector((state) => state.areas.listError);

  const loadAreas = useCallback(() => {
    void dispatch(fetchAreas());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      loadAreas();
    }
  }, [loadAreas, status]);

  return {
    areas,
    isLoading: status === "loading",
    error,
    loadAreas,
  };
};
