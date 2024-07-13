import styles from '../styles/Home.module.css'

export default function Tile({ type = "default", value }) {
  let classNames = [];

  classNames.push(styles.tile)
  classNames.push(type == "default" ? styles.tile__default : styles.tile__empty);
  classNames = classNames.join(" ");
	return (
		<div className={classNames}>
      <h1>
        {value}
      </h1>
		</div>
	)
}
