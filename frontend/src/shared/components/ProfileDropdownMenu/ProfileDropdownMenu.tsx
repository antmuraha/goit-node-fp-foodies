import type { ReactElement } from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import type { MeProfile } from "../../../entities/user/model/types";
import styles from "./ProfileDropdownMenu.module.css";

type ProfileDropdownMenuProps = {
  user: MeProfile;
  onLogout: () => void;
};

export const ProfileDropdownMenu = ({ user, onLogout }: ProfileDropdownMenuProps): ReactElement => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    if (isOpen && e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const items = menuRef.current?.querySelectorAll<HTMLElement>("[role='menuitem']");
      if (!items || items.length === 0) return;

      const currentFocus = document.activeElement;
      let nextIndex = 0;

      if (currentFocus && items.length > 0) {
        const currentIndex = Array.from(items).indexOf(currentFocus as HTMLElement);
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
      }

      items[nextIndex]?.focus();
      return;
    }

    if (isOpen && (e.key === "Enter" || e.key === " ")) {
      if (document.activeElement?.hasAttribute("role") && document.activeElement?.getAttribute("role") === "menuitem") {
        e.preventDefault();
        (document.activeElement as HTMLElement).click();
      }
    }
  }, [isOpen]);

  // Open menu and focus first item
  const handleOpenMenu = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  // Close menu and restore focus
  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleToggleMenu = () => {
    if (isOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  };

  const handleProfileClick = () => {
    navigate(APP_ROUTES.USER.replace(":id", user.id.toString()));
    handleCloseMenu();
  };

  const handleLogoutClick = () => {
    onLogout();
    handleCloseMenu();
  };

  const avatarContent = user.avatar ? (
    <img src={user.avatar} alt={user.name} className={styles.avatar} />
  ) : (
    <div className={styles.avatarFallback}>{user.name?.[0]?.toUpperCase() || "U"}</div>
  );

  return (
    <div className={styles.container}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={handleToggleMenu}
        onKeyDown={handleKeyDown}
        aria-label={`${user.name} profile menu`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        {avatarContent}
        <span className={styles.name}>{user.name}</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ul ref={menuRef} className={styles.menu} role="menu">
          <li>
            <button
              className={styles.menuItem}
              onClick={handleProfileClick}
              role="menuitem"
              type="button"
            >
              View Profile
            </button>
          </li>
          <li>
            <button
              className={styles.menuItem}
              onClick={handleLogoutClick}
              role="menuitem"
              type="button"
            >
              Log Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
