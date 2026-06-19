import styles from "../styles/Home.module.css"

export default function StatWrapper({ type, value }) {
  return (
    <div className={styles.statWrapper}>
      <p className={styles.statTitle}>{type}</p>
      <h1 className={styles.statValue}>{value}</h1>
    </div>
  )
}
