import { useEffect } from "react";
import styles from "../styles/Home.module.css"
import { Minus, Plus } from 'lucide-react';

export default function OptionsWrapper({ size, setSize, shuffle, setShuffle }) {
  const handleClick = () => {
    setShuffle(true);
  }

  return (
    <div className={styles.optionsWrapper}>
      <h1 className={styles.optionsTitle}>Options</h1>
      <div className={styles.optionsGroupWrapper}>
        <h2 className={styles.optionsGroupTitle}>Grid Size</h2>
        <div className={styles.sizeInputWrapper}>
          <button
            className={`${styles.btn} ${styles.btnSmall} ${styles.btn__outline}`}
            onClick={() => {
              setSize((size) => size - 1)
            }}
          >
            <Minus size={16} />
          </button>
          <input
            type='number'
            value={size}
            className={styles.input}
            disabled
            />
          <button
            className={`${styles.btn} ${styles.btnSmall} ${styles.btn__outline}`}
            onClick={() => {
              setSize((size) => size + 1)
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button
        className={
          `${styles.btn} ${styles.btnMedium} ${styles.btn__outline}
           ${styles.optionsAction}
          `
        }
        onClick={() => {handleClick()}}
      >
        Shuffle
      </button>
    </div>
  )
}
