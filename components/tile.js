import styles from './tile.module.css'
import { motion } from "framer-motion"

export default function Tile({ type = "default", background = false, value }) {
  let classNames = [];

  const tileVariants = {
    win: {
      backgroundColor: "var(--accent-victory)",
      color: "var(--text-victory)",
    },
    default: {
      backgroundColor: null,
      color: null,
    },
    hover: {
      scale: 1.05,
    }
  }

  classNames.push(styles.tile)
  classNames.push(type == "default" ? styles.tile__default : styles.tile__empty);
  classNames = classNames.join(" ");

	return (
		<motion.div
      className={classNames}
      key={`key-${background}`}
      variants={ tileVariants }
      animate={background ? 'win' : 'default'}
      whileHover="hover"
    >
      <h1>
        {value}
      </h1>
		</motion.div>
	)
}
