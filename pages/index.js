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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Radio+Canada+Big:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <style jsx global>{`
          html {
            font-family: "Radio Canada Big"
          }
        `}</style>
			</Head>
			<main>
        <Grid />
        {/* <div className={styles.actionWrapper}>
          <button className={`${styles.btn} ${styles.btn__secondary}`}>Shuffle</button>
          <button className={`${styles.btn} ${styles.btn__secondary}`}>Solve</button>
        </div> */}
			</main>
		</div>
  );
}
