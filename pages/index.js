import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Grid from "./grid"

export default function Home() {
  return (
		<div className={styles.container}>
			<Head>
				<title>Sliding Puzzle</title>
				<meta name="color-scheme" content="dark light"></meta>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
        <Grid />
        <div className={styles.actionWrapper}>
          <button className={`${styles.btn} ${styles.btn__secondary}`}>Shuffle</button>
          <button className={`${styles.btn} ${styles.btn__secondary}`}>Solve</button>
        </div>
			</main>
		</div>
  );
}
