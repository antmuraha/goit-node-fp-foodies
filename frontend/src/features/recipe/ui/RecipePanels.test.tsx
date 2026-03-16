import { render, screen } from "@testing-library/react";
import RecipeIngredientsPanel from "./RecipeIngredientsPanel";
import RecipeInstructionsPanel from "./RecipeInstructionsPanel";
import type { RecipeIngredientDetails } from "../../entities/ingredient/types";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockIngredients: RecipeIngredientDetails[] = [
  {
    id: 1,
    name: "Salmon",
    image: "http://localhost:3845/assets/salmon.png",
    RecipeIngredient: { quantity: "400", unit: "g" },
  },
  {
    id: 2,
    name: "Avocado",
    image: "http://localhost:3845/assets/avocado.png",
    RecipeIngredient: { quantity: "3", unit: null },
  },
  { id: 3, name: "Lime", image: null, RecipeIngredient: { quantity: "1", unit: null } },
];

const multiLineInstructions = "Preheat oven to 180°C.\nMix flour and sugar.\nBake for 30 minutes.";
const numberedInstructions = "1. Preheat oven.\n2. Mix ingredients.\n3. Bake.";
const singleLineInstructions = "Mix everything and cook until done.";

// ─── RecipeIngredientsPanel ───────────────────────────────────────────────────

describe("RecipeIngredientsPanel", () => {
  it("renders heading", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    expect(screen.getByRole("heading", { name: /ingredients/i })).toBeInTheDocument();
  });

  it("renders ingredient name, quantity and unit", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    expect(screen.getByText("Salmon")).toBeInTheDocument();
    expect(screen.getByText("400 g")).toBeInTheDocument();
  });

  it("renders quantity without unit when unit is null", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders ingredient image when provided", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    const img = screen.getByAltText("Salmon");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "http://localhost:3845/assets/salmon.png");
  });

  it("renders placeholder when ingredient image is null", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    // Lime has no image — its li should not have an <img>
    const listItems = screen.getAllByRole("listitem");
    const limeItem = listItems.find((li) => li.textContent?.includes("Lime"));
    expect(limeItem?.querySelector("img")).toBeNull();
  });

  it("renders correct number of list items", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(mockIngredients.length);
  });

  it("renders fallback and no list when ingredients are empty", () => {
    render(<RecipeIngredientsPanel ingredients={[]} />);
    expect(screen.getByText(/no ingredients available/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("section has accessible label via aria-labelledby", () => {
    render(<RecipeIngredientsPanel ingredients={mockIngredients} />);
    expect(screen.getByRole("region", { name: /ingredients/i })).toBeInTheDocument();
  });
});

// ─── RecipeInstructionsPanel ─────────────────────────────────────────────────

describe("RecipeInstructionsPanel", () => {
  it("renders heading 'Recipe Preparation' as per design", () => {
    render(<RecipeInstructionsPanel instructions={multiLineInstructions} />);
    expect(screen.getByRole("heading", { name: /recipe preparation/i })).toBeInTheDocument();
  });

  it("renders multi-line instructions as ordered list", () => {
    render(<RecipeInstructionsPanel instructions={multiLineInstructions} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("strips leading numbers from numbered instructions", () => {
    render(<RecipeInstructionsPanel instructions={numberedInstructions} />);
    expect(screen.getByText("Preheat oven.")).toBeInTheDocument();
    expect(screen.getByText("Mix ingredients.")).toBeInTheDocument();
  });

  it("renders single-line instructions as paragraph, not list", () => {
    render(<RecipeInstructionsPanel instructions={singleLineInstructions} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByText(singleLineInstructions)).toBeInTheDocument();
  });

  it("renders fallback when instructions is empty string", () => {
    render(<RecipeInstructionsPanel instructions="" />);
    expect(screen.getByText(/no instructions available/i)).toBeInTheDocument();
  });

  it("renders fallback when instructions is null or undefined", () => {
    const { rerender } = render(<RecipeInstructionsPanel instructions={null} />);
    expect(screen.getByText(/no instructions available/i)).toBeInTheDocument();
    rerender(<RecipeInstructionsPanel instructions={undefined} />);
    expect(screen.getByText(/no instructions available/i)).toBeInTheDocument();
  });

  it("section has accessible label via aria-labelledby", () => {
    render(<RecipeInstructionsPanel instructions={multiLineInstructions} />);
    expect(screen.getByRole("region", { name: /recipe preparation/i })).toBeInTheDocument();
  });
});
