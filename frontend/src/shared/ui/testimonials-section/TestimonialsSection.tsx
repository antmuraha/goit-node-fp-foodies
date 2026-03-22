import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { Icon } from "../../components/Icon";
import { useDataTestimonials } from "../../hooks/useDataTestimonials";
import styles from "./TestimonialsSection.module.css";

const SECTION_SUBTITLE = "What our customer say";
const SECTION_TITLE = "Testimonials";
const AUTO_ROTATE_INTERVAL_MS = 5000;
const TESTIMONIAL_LABEL_PREFIX = "Testimonial";

const clampIndex = (index: number, maxLength: number): number => {
  if (maxLength === 0) {
    return 0;
  }

  return Math.max(0, Math.min(index, maxLength - 1));
};

const TestimonialsSection = (): ReactElement => {
  const { testimonials, isLoading } = useDataTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth"): void => {
      const trackElement = trackRef.current;

      if (!trackElement) {
        return;
      }

      const nextIndex = clampIndex(index, testimonials.length);

      trackElement.scrollTo({
        left: trackElement.clientWidth * nextIndex,
        behavior,
      });
    },
    [testimonials.length],
  );

  useEffect(() => {
    if (testimonials.length === 0) {
      return;
    }

    const normalizedIndex = clampIndex(activeIndex, testimonials.length);

    if (normalizedIndex !== activeIndex) {
      setActiveIndex(normalizedIndex);
      scrollToIndex(normalizedIndex, "auto");
    }
  }, [activeIndex, scrollToIndex, testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        scrollToIndex(nextIndex);

        return nextIndex;
      });
    }, AUTO_ROTATE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [scrollToIndex, testimonials.length]);

  const handleTrackScroll = useCallback((): void => {
    const trackElement = trackRef.current;

    if (!trackElement || testimonials.length <= 1) {
      return;
    }

    const nextIndex = clampIndex(
      Math.round(trackElement.scrollLeft / trackElement.clientWidth),
      testimonials.length,
    );

    setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
  }, [testimonials.length]);

  const handleDotClick = (index: number): void => {
    const nextIndex = clampIndex(index, testimonials.length);

    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

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

        <div
          ref={trackRef}
          className={styles.track}
          onScroll={handleTrackScroll}
          role="region"
          aria-label="Testimonials carousel"
        >
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={styles.slide}
              aria-roledescription="slide"
              aria-label={`${TESTIMONIAL_LABEL_PREFIX} ${index + 1} of ${testimonials.length}`}
            >
              <blockquote className={styles.quote}>
                <p className={styles.quoteText}>{testimonial.content}</p>
                <footer className={styles.author}>
                  <cite className={styles.authorName}>{testimonial.owner.name}</cite>
                </footer>
              </blockquote>
            </article>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => handleDotClick(index)}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${TESTIMONIAL_LABEL_PREFIX} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
