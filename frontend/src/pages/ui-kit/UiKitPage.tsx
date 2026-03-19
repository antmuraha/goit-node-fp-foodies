import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { Button, Checkbox, Input, Modal, Radio, Select, TextArea, Pagination } from "../../shared/ui";
import styles from "./UiKitPage.module.css";
import { Icon } from "../../shared/components/Icon";
import { NumericStepper } from "../../shared/ui/numeric-stepper";

const SERVING_OPTIONS = [
  { value: "1", label: "1 serving" },
  { value: "2", label: "2 servings" },
  { value: "0", label: "4 servings" },
];

export const UiKitPage = (): ReactElement => {
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [servings, setServings] = useState<string>(SERVING_OPTIONS[0].value);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageManyPages, setCurrentPageManyPages] = useState<number>(1);
  const [cookingTime, setCookingTime] = useState<number>(10);

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
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Modal</h2>
          <div className={styles.column}>
            <div className={styles.row}>
              <Button onClick={() => setIsSignInModalOpen(true)}>Sign In Modal</Button>
              <Button onClick={() => setIsSignUpModalOpen(true)}>Sign Up Modal</Button>
              <Button onClick={() => setIsLogoutModalOpen(true)}>Logout Modal</Button>
            </div>
          </div>
        </article>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Icons</h2>
          <div className={styles.row}>
            <Icon name="eye" color="action-secondary-text" size={24} />
            <Icon name="eye-off" color="action-secondary-text" size={24} />
            <Icon name="arrow-up-right" color="action-secondary-text" size={24} />
            <Icon name="burger-menu" color="action-secondary-text" size={24} />
            <Icon name="chevron-down" color="action-secondary-text" size={24} />
            <Icon name="close" color="action-secondary-text" size={24} />
            <Icon name="heart" color="action-secondary-text" size={24} />
            <Icon name="logo" color="action-secondary-text" size={24} />
            <Icon name="quote" color="action-secondary-text" size={24} />
            <Icon name="trash" color="action-secondary-text" size={24} />
            <Icon name="instagram" color="action-secondary-text" size={24} />
            <Icon name="youtube" color="action-secondary-text" size={24} />
            <Icon name="facebook" color="action-secondary-text" size={24} />
          </div>
        </article>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Pagination</h2>
          <div className={styles.column}>
            <div>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--fd-text-muted)" }}>
                Pagination with 5 pages
              </p>
              <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
            </div>
            <div style={{ marginTop: "24px" }}>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--fd-text-muted)" }}>
                Pagination with 15 pages (shows ellipsis)
              </p>
              <Pagination currentPage={currentPageManyPages} totalPages={15} onPageChange={setCurrentPageManyPages} />
            </div>
          </div>
        </article>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Numeric Stepper</h2>
          <div className={styles.column}>
            <NumericStepper
              label="Cooking time"
              value={cookingTime}
              min={10}
              max={480}
              step={10}
              onChange={(val) => setCookingTime(val)}
            />
          </div>
        </article>
      </section>

      <Modal
        isOpen={isSignInModalOpen}
        title="Sign In"
        onClose={() => setIsSignInModalOpen(false)}
        closeOnEscape
        closeOnOverlayClick
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Input type="email" placeholder="Email*" />
          <Input type="password" placeholder="Password" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Button onClick={() => setIsSignInModalOpen(false)}>Sign In</Button>
          <p style={{ textAlign: "center", margin: "0", fontSize: "14px" }}>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => {
                setIsSignInModalOpen(false);
                setIsSignUpModalOpen(true);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--fd-color-main)",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "inherit",
              }}
            >
              Create an account
            </button>
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isSignUpModalOpen}
        title="SIGN UP"
        onClose={() => setIsSignUpModalOpen(false)}
        closeOnEscape
        closeOnOverlayClick
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input type="text" placeholder="Name*" />
          <Input type="email" placeholder="Email*" />
          <Input type="password" placeholder="Password" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Button style={{ marginTop: "8px" }} onClick={() => setIsSignUpModalOpen(false)}>
            CREATE
          </Button>
          <p style={{ textAlign: "center", margin: "8px 0 0 0", fontSize: "14px" }}>
            I already have an account?{" "}
            <button
              onClick={() => {
                setIsSignUpModalOpen(false);
                setIsSignInModalOpen(true);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--fd-color-main)",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "inherit",
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isLogoutModalOpen}
        title="ARE YOU LOGGING OUT?"
        onClose={() => setIsLogoutModalOpen(false)}
        closeOnEscape
        closeOnOverlayClick
      >
        <p className={styles.logoutDescription}>You can always log back in at any time.</p>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "16px" }}>
          <Button
            onClick={() => setIsLogoutModalOpen(false)}
            style={{
              width: "100%",
              height: "56px",
              borderRadius: "30px",
              backgroundColor: "#050505",
              color: "#fff",
            }}
          >
            LOG OUT
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsLogoutModalOpen(false)}
            style={{
              width: "100%",
              height: "56px",
              borderRadius: "30px",
              border: "1px solid #050505",
              backgroundColor: "#fff",
              color: "#050505",
            }}
          >
            CANCEL
          </Button>
        </div>
      </Modal>
    </main>
  );
};
