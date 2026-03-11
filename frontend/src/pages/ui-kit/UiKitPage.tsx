import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { Button, Checkbox, Input, Radio, Select, TextArea } from "../../shared/ui";
import styles from "./UiKitPage.module.css";

const SERVING_OPTIONS = [
  { value: "1", label: "1 serving" },
  { value: "2", label: "2 servings" },
  { value: "4", label: "4 servings" },
];

export const UiKitPage = (): ReactElement => {
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [servings, setServings] = useState<string>(SERVING_OPTIONS[0].value);

  const handlePublishToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsPublished(event.target.checked);
  };

  const handleServingsChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setServings(event.target.value);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Temporary internal preview</p>
        <h1 className={styles.title}>UI Kit playground</h1>
        <p className={styles.subtitle}>
          Lightweight showcase for reusable primitives before we introduce full Storybook.
        </p>
      </header>

      <section className={styles.grid} aria-label="Button states">
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Buttons</h2>
          <div className={styles.row}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>Disabled</Button>
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Inputs</h2>
          <div className={styles.column}>
            <Input placeholder="Recipe title" />
            <Input defaultValue="Broken validation state" hasError aria-invalid="true" />
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Select and textarea</h2>
          <div className={styles.column}>
            <Select value={servings} onChange={handleServingsChange}>
              {SERVING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <TextArea rows={4} placeholder="Recipe description" />
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Selection controls</h2>
          <div className={styles.controls}>
            <label className={styles.controlLabel}>
              <Checkbox checked={isPublished} onChange={handlePublishToggle} />
              Publish now
            </label>
            <label className={styles.controlLabel}>
              <Radio name="visibility" defaultChecked />
              Public
            </label>
            <label className={styles.controlLabel}>
              <Radio name="visibility" />
              Private draft
            </label>
          </div>
        </article>
      </section>
    </main>
  );
};
