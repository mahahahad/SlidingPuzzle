import styles from '../styles/Home.module.css';
import Grid from "./grid"

export default function Home() {
  return (
    <div className={styles.container}>
      <Grid />
      {/* <div className={styles.actionWrapper}>
        <button className={`${styles.btn} ${styles.btn__secondary}`}>Shuffle</button>
        <button className={`${styles.btn} ${styles.btn__secondary}`}>Solve</button>
        </div> */}
    </div>
  );
}
