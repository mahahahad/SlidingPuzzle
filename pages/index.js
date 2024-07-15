import styles from '../styles/Home.module.css';
import Grid from "./grid"
import MoveWrapper from './moveWrapper';
import { useState } from "react";
import OptionsWrapper from './optionsWrapper';

export default function Home() {
  const [moves, setMoves] = useState(0);
  const [size, setSize] = useState(3);
  const [shuffle, setShuffle] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.gridWrapper} >
        <MoveWrapper moves={moves} />
        <Grid
          shuffle={shuffle}
          setShuffle={setShuffle}
          size={size}
          moves={moves}
          setMoves={setMoves}
        />
      </div>
      <OptionsWrapper
        size={size}
        setSize={setSize}
        shuffle={shuffle}
        setShuffle={setShuffle}
      />
    </div>
  );
}
