import Head from "next/head";
import styles from "../styles/Home.module.css";
import mazeStyles from "../styles/Maze.module.css";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function Home() {
  const [builder, setBuilder] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [guy, setGuy] = useState([0, 0]);
  const [otherGuy, setOtherGuy] = useState([0, 0]);
  const [keyLocation, setKeyLocation] = useState([0, 0]);
  const [guysPastLocations, setGuysPastLocations] = useState([]);
  const [otherGuysPastLocations, setOtherGuysPastLocations] = useState([]);

  useEffect(() => {
    if (builder) {
      const interval = setInterval(() => startRace(), 50);
    return () => {
    clearInterval(interval);
    };
  }
  }, [builder]);

  if (builder && isFirstTime) {
    const mazeKeyObject = builder.placeKey();
    const coords = [mazeKeyObject.fr, mazeKeyObject.fc];
    setKeyLocation(coords);
    let tempBuilder = JSON.parse(JSON.stringify(builder));
    tempBuilder.maze = mazeKeyObject.maze;
    setBuilder(tempBuilder);
    setIsFirstTime(false);
  }

  const startRace = () => {
    let tempBuilder = JSON.parse(JSON.stringify(builder));
    const availableMoves = getAvailableMoves(guy);
    if (availableMoves.length === 0 && guysPastLocations.length > 0) {
      // need to move back
      tempBuilder = movePlayer(
        tempBuilder,
        guy,
        "guy",
        guysPastLocations[guysPastLocations.length - 1][0],
        guysPastLocations[guysPastLocations.length - 1][1],
        true
      );
    } else if (availableMoves.length > 0) {
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      tempBuilder = movePlayer(
        tempBuilder,
        guy,
        "guy",
        randomMove[0],
        randomMove[1],
        false
      );
    } else {

    }
    const otherGuysAvailableMoves = getAvailableMoves(otherGuy);
    if (otherGuysAvailableMoves.length === 0 && otherGuysPastLocations.length > 0) {
      tempBuilder = movePlayer(
        tempBuilder,
        otherGuy,
        "other_guy",
        otherGuysPastLocations[otherGuysPastLocations.length - 1][0],
        otherGuysPastLocations[otherGuysPastLocations.length - 1][1],
        true
      );
    } else if (otherGuysAvailableMoves.length > 0) {
      const randomMove =
        otherGuysAvailableMoves[Math.floor(Math.random() * otherGuysAvailableMoves.length)];
      tempBuilder = movePlayer(
        tempBuilder,
        otherGuy,
        "other_guy",
        randomMove[0],
        randomMove[1],
        false
      );
    }
    setBuilder(tempBuilder);
    return;
  };

  const getAvailableMoves = (player) => {
    const availableMoves = [];
    const currentX = player[0];
    const currentY = player[1];

    // up
    let moveX = currentX + 1;
    let moveY = currentY + 0;

    if (
      moveX >= 0 &&
      moveY >= 0 &&
      moveX < builder.maze.length &&
      moveY < builder.maze[moveX].length &&
      (builder.maze[moveX][moveY].includes('key') || builder.maze[moveX][moveY].length === 0)
    ) {
      availableMoves.push([moveX, moveY]);
    }

    // down
    moveX = currentX - 1;
    moveY = currentY + 0;

    if (
      moveX >= 0 &&
      moveY >= 0 &&
      moveX < builder.maze.length &&
      moveY < builder.maze[moveX].length &&
      (builder.maze[moveX][moveY].includes('key') || builder.maze[moveX][moveY].length === 0)
    ) {
      availableMoves.push([moveX, moveY]);
    }

    // left
    moveX = currentX + 0;
    moveY = currentY - 1;

    if (
      moveX >= 0 &&
      moveY >= 0 &&
      moveX < builder.maze.length &&
      moveY < builder.maze[moveX].length &&
      (builder.maze[moveX][moveY].includes('key') || builder.maze[moveX][moveY].length === 0)
    ) {
      availableMoves.push([moveX, moveY]);
    }

    // right
    moveX = currentX + 0;
    moveY = currentY + 1;

    if (
      moveX >= 0 &&
      moveY >= 0 &&
      moveX < builder.maze.length &&
      moveY < builder.maze[moveX].length &&
      (builder.maze[moveX][moveY].includes('key') || builder.maze[moveX][moveY].length === 0)
    ) {
      availableMoves.push([moveX, moveY]);
    }

    return availableMoves;
  };

  const movePlayer = (
    tempBuilder,
    player,
    playerName,
    displacementX,
    displacementY,
    movingBack
  ) => {

    if (displacementX == keyLocation[0] && displacementY == keyLocation[1]) {
      if (playerName === "guy") // red 
      {
        window.alert('red player wins');
      } else {
        window.alert('blue player wins');
      }
      return;
    }

    tempBuilder.maze[player[0]][player[1]] = ['door'];

    if (playerName === "guy") {
      let tempGuysPastLocations = guysPastLocations.slice();
      if (movingBack) {
        if (!(tempGuysPastLocations.length === 1))
        {
          tempGuysPastLocations.pop();
        }
      } else {
        tempGuysPastLocations.push([player[0], player[1]]);
      }
      setGuysPastLocations(tempGuysPastLocations);
      setGuy([displacementX, displacementY]);
    } else {
      let tempOtherGuysPastLocations = otherGuysPastLocations.slice();
      if (movingBack) {
        if (!(tempOtherGuysPastLocations.length === 1))
        {
          tempOtherGuysPastLocations.pop();
        }
      } else {
        tempOtherGuysPastLocations.push([player[0], player[1]]);
      }
      setOtherGuysPastLocations(tempOtherGuysPastLocations);
      setOtherGuy([displacementX, displacementY]);
    }
    tempBuilder.maze[displacementX][displacementY] = [playerName];
    return tempBuilder;
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Script
          id="maze-js"
          src="/static/maze.js"
          onLoad={() => setBuilder(new MazeBuilder(14, 12))}
        />
      </div>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            startRace();
          }}
          style={{ marginBottom: "12px", fontSize: "24px" }}
        >
          Start
        </button>
        <div className={styles.maze_container}>
          {builder && builder.maze.length > 0 && (
            <div className={mazeStyles.maze}>
              {builder.maze.map((item, outerIndex) => (
                <div key={outerIndex}>
                  {item.map((innerKey, innerIndex) => {
                    if (
                      outerIndex === 0 &&
                      mazeStyles[innerKey] === undefined
                    ) {
                      const tempBuilder = JSON.parse(JSON.stringify(builder));
                      tempBuilder.maze[outerIndex][innerIndex] = ["guy"];
                      setBuilder(tempBuilder);
                      setGuy([outerIndex, innerIndex]);
                    }
                    if (
                      outerIndex === builder.maze.length - 1 &&
                      mazeStyles[innerKey] === undefined
                    ) {
                      const tempBuilder = JSON.parse(JSON.stringify(builder));
                      tempBuilder.maze[outerIndex][innerIndex] = ["other_guy"];
                      setBuilder(tempBuilder);
                      setOtherGuy([outerIndex, innerIndex]);
                    }
                    return (
                      <div
                        key={innerIndex}
                        className={mazeStyles[innerKey]}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
