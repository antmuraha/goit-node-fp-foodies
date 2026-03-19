import type { ReactElement } from "react";
import type { RecipeIngredientItem } from "../../../entities/ingredient/types";
import styles from "./RecipeIngredientsPanel.module.css";

interface RecipeIngredientsPanelProps {
  ingredients: RecipeIngredientItem[];
}

const RecipeIngredientsPanel = ({ ingredients }: RecipeIngredientsPanelProps): ReactElement => {
  if (!ingredients || ingredients.length === 0) {
    return (
      <section className={styles.panel} aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading" className={styles.heading}>
          Ingredients
        </h2>
        <p className={styles.empty}>No ingredients available.</p>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="ingredients-heading">
      <h2 id="ingredients-heading" className={styles.heading}>
        Ingredients
      </h2>
      <ul className={styles.list}>
        {ingredients.map((item) => {
          return (
            <li key={item.id} className={styles.item}>
              <div className={styles.imageWrapper}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className={styles.image} />
                ) : (
                  <div className={styles.imagePlaceholder} aria-hidden="true" />
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.measure}>{item.measure || "—"}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RecipeIngredientsPanel;
