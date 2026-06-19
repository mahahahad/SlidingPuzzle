import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ChevronDown, Shuffle } from "lucide-react";

export default function OptionsWrapper({ size, setSize, shuffle, setShuffle }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleShuffleClick = () => {
    setShuffle(true);
  };

  const handleSizeSelect = (newSize) => {
    setSize(newSize);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sizeOptions = [3, 4, 5, 6];

  return (
    <div className={styles.settingsBar}>
      {/* Grid Size Dropdown */}
      <div className={styles.dropdownContainer} ref={dropdownRef}>
        <button
          className={styles.settingsBtn}
          onClick={() => setIsOpen(!shuffle && !isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>
            {size}x{size}
          </span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          />
        </button>

        {isOpen && (
          <ul className={styles.dropdownMenu} role="listbox">
            {sizeOptions.map((opt) => (
              <li
                key={opt}
                className={`${styles.dropdownItem} ${opt === size ? styles.dropdownItemActive : ""}`}
                onClick={() => handleSizeSelect(opt)}
                role="option"
                aria-selected={opt === size}
              >
                {opt}x{opt}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Shuffle Button */}
      <button className={styles.settingsBtn} onClick={handleShuffleClick}>
        <Shuffle size={16} />
        <span>Shuffle</span>
      </button>
    </div>
  );
}
