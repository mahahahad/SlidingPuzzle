import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Tile from "../components/tile";
import { motion } from "framer-motion";

// Check if each element in each row of the grid is sorted
// Loops through each element and checks if it is less than the next element
// If it isn't, returns immediately
const isSorted = (tiles) => {
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

/**
 * Gets the location of the tile with the max value from the provided 2D array
 * of numbers and returns it as a tile object.
 * 
 * @param {number[][]} tiles The 2D array of numbers to find the max from
 * @returns {{x: number, y: number, value: number}} maxTile
 */
function getMaxTile(tiles) {
  let highest;
  let maxTile = {
    x: 0,
    y: 0,
    value: 0,
  };

  tiles.forEach((row, y) => {
    row.forEach((el, x) => {
      if (!highest || el > highest){
        highest = el
        maxTile.x = x;
        maxTile.y = y;
        maxTile.value = el;
      };
    });
  });
  return (maxTile);
};

/**
 * Get a random direction from the provided tile ensuring that it is within
 * the grid and that it is not the previous direction.
 * Appends directions from the DIRECTIONS object to the validDirections array
 * based on which tiles the currentTile can move to and returns a random
 * direction from this array.
 * 
 * @param {{x: number, y: number}} prevDirection
 * @param {{x: number, y: number, value: number}} currentTile
 * @param {number[][]} tiles
 * @returns 
 */
function getRandomValidDirection(prevDirection, currentTile, tiles) {
  const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    RIGHT: { x: 1, y: 0 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 }
  };
  let validDirections = [];
  let randomInt;

  // console.log(JSON.stringify(prevDirection) == JSON.stringify(DIRECTIONS.UP));
  if (
    currentTile.y != 0 &&
    JSON.stringify(prevDirection) != JSON.stringify(DIRECTIONS.DOWN)
  ) {
    validDirections.push(DIRECTIONS.UP);
  }
  if (
    currentTile.y != (tiles.length - 1) &&
    JSON.stringify(prevDirection) != JSON.stringify(DIRECTIONS.UP)
  ) {
    validDirections.push(DIRECTIONS.DOWN);
  }
  if (
    currentTile.x != 0 &&
    JSON.stringify(prevDirection) != JSON.stringify(DIRECTIONS.RIGHT)
  ) {
    validDirections.push(DIRECTIONS.LEFT);
  }
  if (
    currentTile.x != (tiles[0].length - 1) &&
    JSON.stringify(prevDirection) != JSON.stringify(DIRECTIONS.LEFT)
  ) {
    validDirections.push(DIRECTIONS.RIGHT);
  }
  randomInt = Math.floor(Math.random() * validDirections.length);
  return (validDirections[randomInt]);
}

function createGrid(sizeX, sizeY) {
  let grid = [];
  let innerGrid = [];
  let count = 1;

  for (let y = 0; y < sizeY; y++) {
    for (let i = 0; i < sizeX; i++) {
      innerGrid.push(count++);
    }
    grid.push(innerGrid);
    console.log(innerGrid);
    innerGrid = [];
  }
  return (grid);
}

export default function Grid({ moves, setMoves, sizeX = 3, sizeY = 3 }) {
  const [interactable, setInteractable] = useState(false);
	const [tiles, setTiles] = useState(createGrid(sizeX, sizeY));
  const [gameOver, setGameOver] = useState(isSorted(tiles));
  let maxTile = getMaxTile(tiles);

  /**
   * Swap the locations of the currentTile and the maxTile
   * 
   * @param {{x: number, y: number, value: number}} currentTile 
   */
  const swapTiles = (currentTile) => {
    let newTiles = [...tiles];

    if (currentTile.x < 0 || currentTile.y < 0)
      return ;
    newTiles[maxTile.y].splice(maxTile.x, 1, currentTile.value);
    newTiles[currentTile.y].splice(currentTile.x, 1, maxTile.value);

    // Update the tiles
    setTiles(newTiles);

    maxTile = getMaxTile(tiles);
  
		// Check if the grid is sorted and notify user
		isSorted(tiles) ? setGameOver(true) : setGameOver(false);
    return (new Promise((res) => {
      setTimeout(() => {
        res();
      }, 50);
    }))
  };

  /**
   * Shuffle the provided grid of tiles in a way that is still solvable.
   * Moves the empty tile to a randomly selected neighbour, a specified amount
   * of times.
   */
  const shuffleTiles = async () => {
    let newTiles = [...tiles];
    let iterations = sizeX * sizeY;
    let randDirection;

    for (let i = 0; i < iterations; i++) {
      randDirection = getRandomValidDirection(randDirection, maxTile, tiles);
      await swapTiles({
        x: maxTile.x + randDirection.x,
        y: maxTile.y + randDirection.y,
        value: newTiles[maxTile.y + randDirection.y][maxTile.x + randDirection.x]
      });
    }
    setTiles(newTiles);
    setInteractable(true);
  }

  useEffect(() => {
    shuffleTiles();
  }, [])

  /**
   * Check if the currentTile has the maxTile as a neighbour i.e. in locations 
   * that it can move to (Up, Down, Left, Right) and return true or false 
   * respectively
   * 
   * @param {{x: number, y: number, value: number}} currentTile The tile who's 
   * neighbours are to be checked.
   * @returns {boolean}
   */
  const hasMaxNeighbour = (currentTile) => {
    if (
      currentTile.y + 1 < tiles[0].length &&
      tiles[currentTile.y + 1][currentTile.x] == maxTile.value
    )
      return true;
    if (
      currentTile.x + 1 < tiles.length &&
      tiles[currentTile.y][currentTile.x + 1] == maxTile.value
    )
      return true;
    if (
      currentTile.y - 1 >= 0 &&
      tiles[currentTile.y - 1][currentTile.x] == maxTile.value
    )
      return true;
    if (
      currentTile.x - 1 >= 0 &&
      tiles[currentTile.y][currentTile.x - 1] == maxTile.value
    )
      return true;
    return false;
  }

	const handleClick = (tileX, tileY, value) => {
		let currentTile = {
			x: tileX,
			y: tileY,
			value: value,
		};

		// Move only if the currentTile has the maxTile near it
		if (!hasMaxNeighbour(currentTile)) return;
		swapTiles(currentTile);
    setMoves((moves) => moves + 1);
	}

	return (
		<div key="tiles-grid" className={styles.grid} style={{ gridTemplateColumns: `repeat(${sizeX}, 1fr)` }}>
			{tiles?.length > 0 &&
				tiles.map((row, y) => {
					return (
						row?.length > 0 &&
						row.map((tile, x) => (
              <motion.div
                onClick={() => {
                  interactable ?
                  handleClick(
                    x,
                    y,
                    tile,
                  ) : undefined;
                }}
                key={`tile-${tile}`}
                layoutId={`tile-${tile}`}
                transition={{ type: "spring", stiffness: 300, damping: 20}}
              >
                <Tile
                  type={
                    tile == maxTile.value
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
