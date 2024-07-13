import { useState } from "react";
import styles from "../styles/Home.module.css";
import Tile from "../components/tile";
import { motion } from "framer-motion";

export default function Grid() {
	const [tiles, setTiles] = useState([
		[7, 6, 2],
		[3, 9, 8],
		[5, 1, 4],
	]);
  const [gameOver, setGameOver] = useState(false);

  // Move the specified tile to the location of the empty tile
  const swapTiles = (currentTile, emptyTile) => {
    let newTiles = [...tiles];
    newTiles[emptyTile.y].splice(emptyTile.x, 1, currentTile.value);
    newTiles[currentTile.y].splice(currentTile.x, 1, emptyTile.value);
    setTiles(newTiles);
  };

  // Check if each element in each row of the grid is sorted
  // Loops through each element and checks if it is less than the next element
  // If it isn't, returns immediately
  const isSorted = () => {
    const totalNumbers = tiles[0].length * tiles.length;
    let i = 0;

    while (i < totalNumbers) {
      let currentEl =
        tiles[Math.floor(i / tiles[0].length)][i % tiles.length];
      if (i + 1 >= totalNumbers) return true;
      let nextEl =
        tiles[Math.floor((i + 1) / tiles[0].length)][
          (i + 1) % tiles.length
        ];
      if (currentEl > nextEl) return false;
      i++;
    }
    return true;
  }

  // Check if the currentTile has an empty tile in locations that it can move to // (Up, Down, Left, Right) and return true or false respectively
  const getEmptyNeighbour = (currentTile, emptyVal) => {
    if (
      currentTile.y + 1 < tiles[0].length &&
      tiles[currentTile.y + 1][currentTile.x] == emptyVal
    )
      return true;
    if (
      currentTile.x + 1 < tiles.length &&
      tiles[currentTile.y][currentTile.x + 1] == emptyVal
    )
      return true;
    if (
      currentTile.y - 1 >= 0 &&
      tiles[currentTile.y - 1][currentTile.x] == emptyVal
    )
      return true;
    if (
      currentTile.x - 1 >= 0 &&
      tiles[currentTile.y][currentTile.x - 1] == emptyVal
    )
      return true;
    return false;
  }

	const isMax = (num) => {
		let highest;
		tiles.forEach((row) => {
			row.forEach((el) => {
				if (!highest || el > highest) highest = el;
			});
		});
		return num == highest;
	};

	const handleClick = (tileX, tileY, value) => {
		let emptyTile = {
			x: 0,
			y: 0,
			value: 0,
		};
		let currentTile = {
			x: tileX,
			y: tileY,
			value: value,
		};


		// Set empty tile location
		tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				if (isMax(tile)) {
					emptyTile.x = x;
					emptyTile.y = y;
					emptyTile.value = tile;
				}
			});
		});

		// Move only if the move is valid
		if (!getEmptyNeighbour(currentTile, emptyTile.value)) return;
		swapTiles(currentTile, emptyTile);

		// Check if the grid is sorted and notify user
		isSorted(tiles) ? setGameOver(true) : setGameOver(false);
	}

	return (
		<div key="tiles-grid" className={styles.grid} layout>
			{tiles?.length > 0 &&
				tiles.map((row, y) => {
					return (
						row?.length > 0 &&
						row.map((tile, x) => (
              <motion.div
                onClick={() => {
                  handleClick(
                    x,
                    y,
                    tile,
                  );
                }}
                key={`tile-${tile}`}
                layoutId={`tile-${tile}`}
                transition={{ type: "spring", stiffness: 300, damping: 20}}
              >
                <Tile
                  type={
                    isMax(tile)
                      ? "empty"
                      : "default"
                  }
                  background={gameOver}
                  value={tile}
                />
              </motion.div>
						))
					);
				})}
		</div>
	);
}
