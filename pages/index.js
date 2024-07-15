import styles from '../styles/Home.module.css';
import Grid from "./grid"
import MoveWrapper from './moveWrapper';
import { useState } from "react";
import { Minus, Plus } from 'lucide-react';

export default function Home() {
  const [moves, setMoves] = useState(0);

  return (
    <div className={styles.container}>
      <MoveWrapper moves={moves} />
      <Grid moves={moves} setMoves={setMoves}/>
      {/* <div className={styles.gridSizeWrapper}>
        <button className={`${styles.btn} ${styles.btnSmall} ${styles.btnSmall__outline}`}>
          <Minus size={24}/>
        </button>
        <input
          type='number'
          value={3}
          className={styles.input}
          disabled
        />
        <button className={`${styles.btn} ${styles.btnSmall} ${styles.btnSmall__outline}`}>
          <Plus size={24}/>
        </button>
      </div> */}
    </div>
  );
}
