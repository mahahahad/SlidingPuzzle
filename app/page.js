'use client'

import styles from '../styles/Home.module.css';
import Grid from "./grid"
import StatWrapper from './statWrapper';
import { useState, useEffect, useRef } from "react";
import OptionsWrapper from './optionsWrapper';

export default function Home() {
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(3);
  const [shuffle, setShuffle] = useState(false); // Default to true to shuffle initially
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.gridWrapper}>
        <div className={styles.stats}>
          <StatWrapper type={"time"} value={time} />
          <StatWrapper type={"moves"} value={moves} />
        </div>
        <div className={styles.gameplayArea}>
          <OptionsWrapper
            size={size}
            setSize={setSize}
            shuffle={shuffle}
            setShuffle={setShuffle}
          />
          <Grid
            shuffle={shuffle}
            setShuffle={setShuffle}
            size={size}
            moves={moves}
            setMoves={setMoves}
            setTime={setTime}
            setPaused={setPaused}
          />
        </div>
      </div>
    </div>
  );
}
