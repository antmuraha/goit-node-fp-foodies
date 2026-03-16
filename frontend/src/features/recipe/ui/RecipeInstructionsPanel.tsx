import type { ReactElement } from "react";
import styles from "./RecipeInstructionsPanel.module.css";

interface RecipeInstructionsPanelProps {
    instructions: string | null | undefined;
}

const splitIntoSteps = (text: string): string[] => {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter(Boolean);

    return lines.length > 0 ? lines : [text.trim()];
};

const RecipeInstructionsPanel = ({ instructions }: RecipeInstructionsPanelProps): ReactElement => {
    if (!instructions || instructions.trim() === "") {
        return (
            <section className={styles.panel} aria-labelledby="instructions-heading">
                <h2 id="instructions-heading" className={styles.heading}>
                    Recipe Preparation
                </h2>
                <p className={styles.empty}>No instructions available.</p>
            </section>
        );
    }

    const steps = splitIntoSteps(instructions);

    return (
        <section className={styles.panel} aria-labelledby="instructions-heading">
            <h2 id="instructions-heading" className={styles.heading}>
                Recipe Preparation
            </h2>
            {steps.length > 1 ? (
                <ol className={styles.list}>
                    {steps.map((step, idx) => (
                        <li key={idx} className={styles.step}>
                            {step}
                        </li>
                    ))}
                </ol>
            ) : (
                <p className={styles.text}>{steps[0]}</p>
            )}
        </section>
    );
};

export default RecipeInstructionsPanel;