import { useState } from "react";
import type { ReactElement } from "react";
import { Icon } from "../../components/Icon";
import { useDataTestimonials } from "../../hooks/useDataTestimonials";
import styles from "./TestimonialsSection.module.css";

const SECTION_SUBTITLE = "What our customer say";
const SECTION_TITLE = "Testimonials";

const TestimonialsSection = (): ReactElement => {
  const { testimonials, isLoading } = useDataTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <section className={styles.section} aria-label={SECTION_TITLE}>
        <p className={styles.loadingText}>Loading testimonials…</p>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className={styles.section} aria-label={SECTION_TITLE}>
        <div className={styles.header}>
          <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
          <h2 className={styles.title}>{SECTION_TITLE}</h2>
        </div>
        <p className={styles.emptyText}>No testimonials available.</p>
      </section>
    );
  }

  const current = testimonials[activeIndex];

  return (
    <section className={styles.section} aria-label={SECTION_TITLE}>
      <div className={styles.reviews}>
        <div className={styles.header}>
          <p className={styles.subtitle}>{SECTION_SUBTITLE}</p>
          <h2 className={styles.title}>{SECTION_TITLE}</h2>
        </div>

        <div className={styles.quoteIcon} aria-hidden="true">
          <Icon name="quote" width={40} height={32} color="color-muted" />
        </div>

        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{current.content}</p>
          <footer className={styles.author}>
            <cite className={styles.authorName}>{current.owner.name}</cite>
          </footer>
        </blockquote>
      </div>

      {testimonials.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => setActiveIndex(index)}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
