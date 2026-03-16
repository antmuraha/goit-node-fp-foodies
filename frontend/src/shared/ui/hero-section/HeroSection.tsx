import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import heroFoodMain from "../../../assets/images/hero-food-main.webp";
import heroFoodSmall from "../../../assets/images/hero-food-small.webp";
import { APP_ROUTES } from "../../constants/routes";
import styles from "./HeroSection.module.css";

const HERO_TITLE = "Improve Your Culinary Talents";
const HERO_SUBTITLE =
  "Amazing recipes for beginners in the world of cooking, enveloping you in the aromas and tastes of various cuisines.";

export const HeroSection = (): ReactElement => {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.content}>
        <h1 className={styles.title}>{HERO_TITLE}</h1>
        <p className={styles.subtitle}>{HERO_SUBTITLE}</p>
        <Link to={APP_ROUTES.RECIPE_ADD} className={styles.ctaButton}>
          Add recipe
        </Link>
      </div>
      <div className={styles.images} aria-hidden="true">
        <img src={heroFoodMain} alt="" className={styles.imageMain} />
        <img src={heroFoodSmall} alt="" className={styles.imageSmall} />
      </div>
    </section>
  );
};
