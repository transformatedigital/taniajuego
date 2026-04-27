import React, { useState, useEffect, useCallback } from 'react';

const OceanRescueGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [items, setItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Emojis para los elementos
  const TRASH = ['🥤', '🥫', '🛍️', '🧴'];
  const NATURE = ['🐟', '🐢', '🌿', '🦀'];

  const generateItems = useCallback(() => {
    const newItems = [];
    // Generar basura
    for (let i = 0; i < 8; i++) {
      newItems.push({
        id: `trash-${i}`,
        type: 'trash',
        emoji: TRASH[Math.floor(Math.random() * TRASH.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
      });
    }
    // Generar naturaleza (peces y algas)
    for (let i = 0; i < 6; i++) {
      newItems.push({
        id: `nature-${i}`,
        type: 'nature',
        emoji: NATURE[Math.floor(Math.random() * NATURE.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 15,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
      });
    }
    setItems(newItems);
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    generateItems();
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    let animationFrame;
    if (isPlaying) {
      const updatePositions = () => {
        setItems((prevItems) =>
          prevItems.map((item) => {
            let newX = item.x + item.speedX;
            let newY = item.y + item.speedY;

            if (newX <= 0 || newX >= 90) {
              item.speedX *= -1;
              newX = Math.max(0, Math.min(90, newX));
            }
            if (newY <= 0 || newY >= 85) {
              item.speedY *= -1;
              newY = Math.max(0, Math.min(85, newY));
            }

            return { ...item, x: newX, y: newY };
          })
        );
        animationFrame = requestAnimationFrame(updatePositions);
      };
      animationFrame = requestAnimationFrame(updatePositions);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const handleCatch = (id, type) => {
    if (!isPlaying) return;

    if (type === 'trash') {
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 font-sans">
      <div className="bg-blue-500 text-white w-full rounded-t-2xl p-4 text-center shadow-md z-10">
        <h1 className="text-2xl font-bold mb-2">🌊 Ocean Rescue Game</h1>
        <p className="text-sm">¡Pesca la basura, pero no toques a los peces ni a las algas!</p>

        <div className="flex justify-between items-center mt-4 bg-blue-600 p-3 rounded-lg">
          <div className="text-xl font-bold">Score: {score}</div>
          <div className="text-xl font-bold">Time: {timeLeft}s</div>
        </div>
      </div>

      <div className="relative w-full h-96 bg-blue-200 overflow-hidden border-4 border-blue-500 rounded-b-2xl shadow-inner">
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
            <button
              onClick={startGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 text-white">
            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
            <p className="text-2xl mb-6">Your score: {score}</p>
            <button
              onClick={startGame}
              className="bg-green-400 hover:bg-green-500 text-green-900 font-bold py-2 px-6 rounded-full text-lg shadow-lg transition hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}

        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCatch(item.id, item.type)}
            className="absolute text-4xl cursor-pointer hover:scale-110 transition-transform active:scale-95"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transition: 'left 0.1s linear, top 0.1s linear',
            }}
          >
            {item.emoji}
          </button>
        ))}

        <div className="absolute bottom-0 w-full h-12 bg-blue-300 opacity-50 rounded-b-xl" />
      </div>
    </div>
  );
};

export default OceanRescueGame;
