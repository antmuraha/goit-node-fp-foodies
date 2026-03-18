import { type ReactElement, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store";
import { fetchIngredients } from "../../../../store/slices/ingredientsSlice";
import { fetchAreas } from "../../../../store/slices/areasSlice";
import styles from "./CategoryFilterPanel.module.css";

export function CategoryFilterPanel(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const ingredients = useSelector((s: RootState) => s.ingredients.list);
  const ingredientsStatus = useSelector((s: RootState) => s.ingredients.listStatus);
  const areas = useSelector((s: RootState) => s.areas.list);
  const areasStatus = useSelector((s: RootState) => s.areas.listStatus);

  const ingredientId = searchParams.get("ingredientId") ?? "";
  const areaId = searchParams.get("areaId") ?? "";

  // Fetch options once — skip if already loaded or in progress
  useEffect(() => {
    if (ingredientsStatus === "idle") dispatch(fetchIngredients());
  }, [dispatch, ingredientsStatus]);

  useEffect(() => {
    if (areasStatus === "idle") dispatch(fetchAreas());
  }, [dispatch, areasStatus]);

  const handleIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSearchParams((prev) => {
      if (e.target.value) {
        prev.set("ingredientId", e.target.value);
      } else {
        prev.delete("ingredientId");
      }
      // Reset pagination when filter changes
      prev.delete("page");
      return prev;
    });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSearchParams((prev) => {
      if (e.target.value) {
        prev.set("areaId", e.target.value);
      } else {
        prev.delete("areaId");
      }
      // Reset pagination when filter changes
      prev.delete("page");
      return prev;
    });
  };

  return (
    <div className={styles.panel} role="search" aria-label="Recipe filters">
      {/* Visually hidden labels satisfy accessibility requirements */}
      <label className={styles.srOnly} htmlFor="filter-ingredient">
        Filter by ingredient
      </label>
      <select
        id="filter-ingredient"
        className={styles.select}
        value={ingredientId}
        onChange={handleIngredientChange}
        disabled={ingredientsStatus === "loading"}
      >
        <option value="">Ingredients</option>
        {ingredients.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <label className={styles.srOnly} htmlFor="filter-area">
        Filter by area
      </label>
      <select
        id="filter-area"
        className={styles.select}
        value={areaId}
        onChange={handleAreaChange}
        disabled={areasStatus === "loading"}
      >
        <option value="">Area</option>
        {areas.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
