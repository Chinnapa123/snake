import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(prev - 2, 80)); // Increase speed
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = timestamp;
      const elapsed = timestamp - lastUpdateTimeRef.current;

      if (elapsed > speed) {
        moveSnake();
        lastUpdateTimeRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[440px]">
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col items-start">
          <span className="text-[#666666] text-[10px] font-mono uppercase tracking-widest">Score</span>
          <span className="text-[20px] text-[#39ff14] font-mono">{score.toString().padStart(3, '0')}</span>
        </div>
        <button
          onClick={() => isGameOver ? resetGame() : setIsPaused(!isPaused)}
          className="px-4 py-1 rounded border border-[#1a1a1a] bg-[#0d0d0d] text-[#e0e0e0] hover:border-[#00f2ff] hover:text-[#00f2ff] transition-all font-mono text-xs uppercase tracking-wider cursor-pointer"
        >
          {isGameOver ? 'Restart' : (isPaused ? 'Start' : 'Pause')}
        </button>
      </div>

      <div 
        className="relative bg-transparent border border-[#111]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#111]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layoutId={`snake-${i}`}
            className="absolute rounded-[2px] bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]"
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
              zIndex: i === 0 ? 10 : 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-[#ff00ff] rounded-full shadow-[0_0_12px_#ff00ff]"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-[#ff00ff] mb-2 tracking-widest uppercase">Game Over</h2>
              <p className="text-[#00f2ff] font-mono mb-6">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-[#00f2ff] text-black font-bold rounded hover:bg-white transition-colors uppercase tracking-widest cursor-pointer"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-[2px]"
            >
              <div className="bg-[#0d0d0d] p-6 rounded border border-[#1a1a1a] text-center">
                <p className="text-[#00f2ff] font-mono mb-2 uppercase tracking-widest">Paused</p>
                <p className="text-[#666666] text-xs">Press SPACE or click Start</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[#666666] text-[10px] font-mono uppercase tracking-[0.2em]">
        Use Arrow Keys to Move • Space to Pause
      </div>
    </div>
  );
};
