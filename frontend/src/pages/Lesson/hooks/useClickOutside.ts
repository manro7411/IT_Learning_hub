// src/hooks/useClickOutside.ts
import { useEffect } from "react";

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onClose: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onClose]);
};