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
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handlePublishToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsPublished(event.target.checked);
  };

  const handleServingsChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setServings(event.target.value);
  };

  const handleCheckboxToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(event.target.checked);
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
          <h2 className={styles.cardTitle}>Input - Text</h2>
          <div className={styles.column}>
            <Input type="text" label="Recipe Title" placeholder="Enter recipe name" />
            <Input
              type="text"
              label="Recipe Title with Hint"
              placeholder="Enter recipe name"
              hint="Use descriptive names for better searchability"
            />
            <Input
              type="text"
              label="Recipe Title with Error"
              placeholder="Enter recipe name"
              error="Recipe title is required"
              defaultValue="Invalid"
            />
            <Input type="text" label="Disabled Text Input" defaultValue="Cannot edit this field" disabled />
            <Input type="text" label="Read-only Text Input" defaultValue="This field is read-only" readOnly />
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Input - Email</h2>
          <div className={styles.column}>
            <Input type="email" label="Email Address" placeholder="user@example.com" />
            <Input
              type="email"
              label="Email with Hint"
              placeholder="user@example.com"
              hint="We'll never share your email address"
            />
            <Input
              type="email"
              label="Invalid Email"
              placeholder="user@example.com"
              error="Please enter a valid email address"
              defaultValue="not-an-email"
            />
            <Input type="email" label="Disabled Email" defaultValue="disabled@example.com" disabled />
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Input - Password</h2>
          <div className={styles.column}>
            <Input type="password" label="Password" placeholder="Enter your password" />
            <Input
              type="password"
              label="Password with Hint"
              placeholder="Enter your password"
              hint="At least 8 characters with uppercase, lowercase, and numbers"
            />
            <Input
              type="password"
              label="Weak Password"
              placeholder="Enter your password"
              error="Password must be at least 8 characters"
              defaultValue="weak"
            />
            <Input type="password" label="Disabled Password" defaultValue="••••••••" disabled />
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Input - Number</h2>
          <div className={styles.column}>
            <Input type="number" label="Servings" placeholder="Number of servings" defaultValue="4" />
            <Input
              type="number"
              label="Prep Time (minutes)"
              placeholder="Enter prep time"
              hint="Time in minutes for preparation"
              defaultValue="30"
            />
            <Input
              type="number"
              label="Invalid Quantity"
              placeholder="Enter quantity"
              error="Quantity must be a positive number"
              defaultValue="-5"
            />
            <Input type="number" label="Disabled Quantity" defaultValue="10" disabled />
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
          <h2 className={styles.cardTitle}>Checkbox</h2>
          <div className={styles.column}>
            <Checkbox label="Default unchecked" />
            <Checkbox label="Default checked" defaultChecked />
            <Checkbox label="Checked state" checked={isChecked} onChange={handleCheckboxToggle} />
            <Checkbox label="Disabled unchecked" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Selection controls (Radio)</h2>
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
