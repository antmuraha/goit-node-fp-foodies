import type { ReactElement } from "react";
import type { RecipeIngredientItem } from "../../../entities/ingredient/types";
import { Icon } from "../../../shared/components/Icon";
import styles from "./RecipeIngredientsPanel.module.css";

interface RecipeIngredientsPanelProps {
    ingredients: RecipeIngredientItem[];
    /** If provided, renders a remove button on each tile (used in Add/Edit form) */
    onRemove?: (index: number) => void;
    /** Whether to show the "Ingredients" heading. Defaults to true */
    showHeading?: boolean;
}

const RecipeIngredientsPanel = ({
                                    ingredients,
                                    onRemove,
                                    showHeading = true,
                                }: RecipeIngredientsPanelProps): ReactElement => {
    if (!ingredients || ingredients.length === 0) {
        return (
            <section className={styles.panel} aria-labelledby="ingredients-heading">
                {showHeading && (
                    <h2 id="ingredients-heading" className={styles.heading}>
                        Ingredients
                    </h2>
                )}
                <p className={styles.empty}>No ingredients available.</p>
            </section>
        );
    }

    return (
        <section className={styles.panel} aria-labelledby="ingredients-heading">
            {showHeading && (
                <h2 id="ingredients-heading" className={styles.heading}>
                    Ingredients
                </h2>
            )}
            <ul className={styles.list}>
                {ingredients.map((item, index) => (
                    <li key={item.id} className={styles.item}>
                        {/* Remove button — only rendered when onRemove is provided (Add/Edit form) */}
                        {onRemove && (
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => onRemove(index)}
                                aria-label={`Remove ${item.name}`}
                            >
                                <Icon name="close" color="text-primary" size={12} />
                            </button>
                        )}

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
                ))}
            </ul>
        </section>
    );
};

export default RecipeIngredientsPanel;