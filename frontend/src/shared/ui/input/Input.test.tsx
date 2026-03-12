import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input Component", () => {
  describe("Basic rendering", () => {
    it("renders an input element", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("renders with correct type attribute", () => {
      render(<Input type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("renders with different input types", () => {
      const { rerender } = render(<Input type="password" />);
      expect(screen.getByDisplayValue("")).toHaveAttribute("type", "password");

      rerender(<Input type="number" />);
      expect(screen.getByDisplayValue("")).toHaveAttribute("type", "number");

      rerender(<Input type="text" />);
      expect(screen.getByDisplayValue("")).toHaveAttribute("type", "text");
    });
  });

  describe("Label", () => {
    it("renders label when provided", () => {
      render(<Input label="Email Address" />);
      const label = screen.getByText("Email Address");
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("LABEL");
    });

    it("associates label with input via htmlFor/id", () => {
      render(<Input label="Username" id="username-input" />);
      const label = screen.getByText("Username");
      expect(label).toHaveAttribute("for", "username-input");
    });

    it("generates unique id when not provided", () => {
      const { rerender } = render(<Input label="First" />);
      const firstLabel = screen.getByText("First");
      const firstId = firstLabel.getAttribute("for");

      rerender(<Input label="Second" />);
      const secondLabel = screen.getByText("Second");
      const secondId = secondLabel.getAttribute("for");

      expect(firstId).not.toBe(secondId);
    });

    it("does not render label when not provided", () => {
      render(<Input />);
      const labels = screen.queryAllByRole("heading");
      // Search for any label in the document (there shouldn't be one)
      expect(document.querySelectorAll("label").length).toBe(0);
    });
  });

  describe("Error handling", () => {
    it("renders error message when provided", () => {
      render(<Input error="Email is required" />);
      const error = screen.getByText("Email is required");
      expect(error).toBeInTheDocument();
    });

    it("displays error with correct role for accessibility", () => {
      render(<Input error="Invalid input" />);
      const error = screen.getByRole("alert");
      expect(error).toHaveTextContent("Invalid input");
    });

    it("sets aria-invalid when error is present", () => {
      const { rerender } = render(<Input error="Error message" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");

      rerender(<Input hasError={false} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
    });

    it("sets aria-describedby pointing to error id", () => {
      render(<Input id="test-input" error="Error message" />);
      const input = screen.getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toContain("test-input-error");
    });

    it("applies error class to input when error exists", () => {
      const { rerender } = render(<Input error="Error" />);
      let input = screen.getByRole("textbox");
      expect(input.className).toContain("error");

      rerender(<Input hasError={false} />);
      input = screen.getByRole("textbox");
      expect(input.className).not.toContain("error");
    });

    it("hides hint text when error is present", () => {
      const { rerender } = render(<Input hint="This is a hint" error="This is an error" />);
      expect(screen.queryByText("This is a hint")).not.toBeInTheDocument();
      expect(screen.getByText("This is an error")).toBeInTheDocument();

      rerender(<Input hint="This is a hint" />);
      expect(screen.getByText("This is a hint")).toBeInTheDocument();
    });
  });

  describe("Hint text", () => {
    it("renders hint text when provided", () => {
      render(<Input hint="Password must be at least 8 characters" />);
      const hint = screen.getByText("Password must be at least 8 characters");
      expect(hint).toBeInTheDocument();
    });

    it("sets aria-describedby pointing to hint id", () => {
      render(<Input id="pwd-input" hint="8 characters minimum" />);
      const input = screen.getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toContain("pwd-input-hint");
    });

    it("does not render hint when error exists", () => {
      render(<Input hint="Helpful text" error="Error text" />);
      expect(screen.queryByText("Helpful text")).not.toBeInTheDocument();
      expect(screen.getByText("Error text")).toBeInTheDocument();
    });

    it("does not render hint when not provided", () => {
      render(<Input />);
      // Since we can't easily query for hint text, check document structure
      const hints = document.querySelectorAll('[class*="hintText"]');
      expect(hints.length).toBe(0);
    });
  });

  describe("Value changes", () => {
    it("handles value changes when controlled", async () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />);
      const input = screen.getByDisplayValue("initial") as HTMLInputElement;
      expect(input.value).toBe("initial");

      rerender(<Input value="updated" onChange={() => {}} data-testid="test-input" />);
      const updatedInput = screen.getByDisplayValue("updated") as HTMLInputElement;
      expect(updatedInput.value).toBe("updated");
    });

    it("calls onChange handler on value change", async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      await userEvent.type(input, "test");
      expect(handleChange).toHaveBeenCalled();
    });

    it("supports uncontrolled usage with defaultValue", async () => {
      render(<Input defaultValue="default text" />);
      const input = screen.getByDisplayValue("default text") as HTMLInputElement;
      expect(input.value).toBe("default text");

      await userEvent.clear(input);
      await userEvent.type(input, "new text");
      expect(input.value).toBe("new text");
    });
  });

  describe("Disabled state", () => {
    it("applies disabled attribute", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it("applies disabled class", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain("disabled");
    });

    it("prevents user interaction when disabled", async () => {
      const handleChange = vi.fn();
      render(<Input disabled onChange={handleChange} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      // User can't type in disabled input
      await userEvent.type(input, "text");
      expect(input.value).toBe("");
    });

    it("disables label interaction when input is disabled", () => {
      render(<Input label="Username" disabled id="test-input" />);
      const label = screen.getByText("Username");
      expect(label).toHaveAttribute("for", "test-input");
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  describe("Read-only state", () => {
    it("applies readOnly attribute", () => {
      render(<Input readOnly value="Read only text" onChange={() => {}} />);
      const input = screen.getByDisplayValue("Read only text") as HTMLInputElement;
      expect(input).toHaveAttribute("readOnly");
    });

    it("applies readOnly class", () => {
      render(<Input readOnly value="test" onChange={() => {}} />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain("readOnly");
    });

    it("allows focus but not editing when read-only", async () => {
      render(<Input readOnly value="Original" onChange={() => {}} />);
      const input = screen.getByDisplayValue("Original") as HTMLInputElement;

      input.focus();
      expect(input).toHaveFocus();

      // Attempting to type should not change value
      await userEvent.type(input, " more text");
      expect(input.value).toBe("Original");
    });
  });

  describe("Input types", () => {
    it("renders text input by default", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders email input type", () => {
      render(<Input type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("renders password input type", () => {
      render(<Input type="password" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "password");
    });

    it("renders number input type", () => {
      render(<Input type="number" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "number");
    });
  });

  describe("Accessibility", () => {
    it("has proper aria attributes for error state", () => {
      render(<Input id="email-input" label="Email" error="Invalid email format" type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "email-input-error");
    });

    it("has proper aria attributes for hint", () => {
      render(<Input id="pwd-input" label="Password" hint="At least 8 characters" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "false");
      expect(input).toHaveAttribute("aria-describedby", "pwd-input-hint");
    });

    it("has proper aria attributes when both error and hint provided", () => {
      render(<Input id="usr-input" error="Username taken" hint="Must be 3-20 characters" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "usr-input-error");
    });

    it("preserves placeholder attribute for accessibility", () => {
      render(<Input placeholder="Enter your email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Enter your email");
    });
  });

  describe("Custom className", () => {
    it("merges custom className with component classes", () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole("textbox");
      expect(input.className).toContain("custom-class");
      expect(input.className).toContain("input");
    });
  });

  describe("Integration scenarios", () => {
    it("renders complete form field with label, input, and error", () => {
      render(
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          error="Please enter a valid email"
        />,
      );

      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("user@example.com")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent("Please enter a valid email");
    });

    it("renders complete form field with label, input, and hint", () => {
      render(
        <Input
          id="username"
          label="Username"
          type="text"
          placeholder="Choose a username"
          hint="3-20 characters, letters and numbers only"
        />,
      );

      expect(screen.getByText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Choose a username")).toBeInTheDocument();
      expect(screen.getByText("3-20 characters, letters and numbers only")).toBeInTheDocument();
    });

    it("handles all states together: label, error, disabled", () => {
      render(<Input id="pwd" label="Password" type="password" error="Password is required" disabled />);

      expect(screen.getByText("Password")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });
});
