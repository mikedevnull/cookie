import { useEffect, useRef, useState } from "react";
import classes from "./three-dot-menu.module.css";

function useOutsideAlerter(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  callBack: (value: boolean) => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callBack(false);
      }
    }
    // Bind the event listener
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, open, callBack]);
}

export default function ThreeDotMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideAlerter(ref, open, setOpen);

  const menuClasses = open
    ? [classes.show, classes.menuPopup].join(" ")
    : classes.menuPopup;

  return (
    <div>
      <svg
        viewBox="0,0 100,100"
        height="20"
        width="auto"
        role="img"
        onClick={() => setOpen(!open)}
      >
        <circle cx="50" cy="15" r="10" />
        <circle cx="50" cy="50" r="10" />
        <circle cx="50" cy="85" r="10" />
      </svg>
      <div ref={ref} className={menuClasses}>
        <ul>
          <li>foo</li>
          <li>bar</li>
        </ul>
      </div>
    </div>
  );
}
