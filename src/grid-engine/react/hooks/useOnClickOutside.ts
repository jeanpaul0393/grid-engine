import { useEffect, type RefObject } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement | null = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;

      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      handler(event);
    };

    const el = ref?.current;

    const targetDoc = el?.ownerDocument || document;

    targetDoc.addEventListener("mousedown", listener);
    targetDoc.addEventListener("touchstart", listener);

    if (document !== targetDoc) {
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
    }

    return () => {
      targetDoc.removeEventListener("mousedown", listener);
      targetDoc.removeEventListener("touchstart", listener);

      if (document !== targetDoc) {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      }
    };
  }, [ref, handler]);
};
