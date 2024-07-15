import styles from "../styles/Home.module.css"

export default function MoveWrapper({ moves }) {
  return (
    <div className={styles.moveWrapper}>
      <h1>Moves: </h1>
      <h1>{moves}</h1>
    </div>
  )
}
