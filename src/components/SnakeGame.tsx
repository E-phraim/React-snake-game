import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Activity, RefreshCcw, Power, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('UP');
    setNextDirection('UP');
    setScore(0);
    setGameOver(false);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': 
          if (gameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (nextDirection) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [nextDirection, food, gameOver, isPaused, speed, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food - Magenta Square
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Snake - Cyan Outlined Squares
    snake.forEach((segment, index) => {
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        segment.x * cellSize + 2,
        segment.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );
      if (index === 0) {
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(segment.x * cellSize + 6, segment.y * cellSize + 6, cellSize - 12, cellSize - 12);
      }
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 tear-container">
      <div className="flex justify-between w-full max-w-[400px] font-pixel text-[8px] bg-cyber-gray p-2 border-b-2 border-neon-cyan">
        <div className="flex items-center gap-2 text-neon-cyan glitch">
          <Activity size={10} />
          <span>DATA_VAL::{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2 text-neon-magenta">
          <span>HIGH::{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group w-full max-w-[400px] aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full pixel-border bg-black"
        />

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center border-4 border-neon-magenta p-8"
            >
              {gameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-pixel text-neon-magenta glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                  <div className="font-mono text-xs text-neon-cyan space-y-1">
                    <p>REASON::SEGMENT_COLLISION_DETECTED</p>
                    <p>FINAL_DATA_RETRIEVAL::{score}</p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-2 bg-neon-magenta text-black font-pixel text-xs hover:bg-white transition-all"
                  >
                    <RefreshCcw size={14} />
                    REBOOT_CORE
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-pixel text-neon-cyan glitch-text" data-text="SIG_HALT">SIG_HALT</h2>
                  <p className="font-mono text-[10px] text-neon-magenta uppercase tracking-tighter">"THE_MACHINE_WAITS..."</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-6 py-2 bg-neon-cyan text-black font-pixel text-xs hover:bg-white transition-all"
                  >
                    <Power size={14} />
                    RESUME_PROCESS
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 text-[8px] font-pixel text-gray-700 bg-cyber-gray w-full max-w-[400px] p-1 border-t-2 border-neon-magenta">
        <Terminal size={10} />
        <span>INPUTS::[ARROWS]_TO_TRANSPOSE // [SPACE]_TO_TOGGLE_STATE</span>
      </div>
    </div>
  );
};

export default SnakeGame;
