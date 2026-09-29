import { useState } from "react";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import EndScreen from "./EndScreen";
import SoundEffects from "./SoundEffects";
import { motion } from "framer-motion";
import { recordProgress } from "@/lib/progress";

interface ArithmeticGameProps {
  initialOperationType?: string;
  onReturnHome: () => void;
  onNextLevel: () => void;
}

const ArithmeticGame = ({ initialOperationType, onReturnHome, onNextLevel }: ArithmeticGameProps) => {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const operationType = initialOperationType || "soma";
  const maxLevels = 20;

  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
  };

  const goToNextLevel = () => {
    recordProgress(operationType, currentLevel + 1, score);
    if (currentLevel + 1 >= maxLevels) setGameState("end");
    else setCurrentLevel((prev) => prev + 1);
  };

  return (
    <motion.div
      className="container mx-auto py-8 px-4 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SoundEffects />
      {gameState === "start" && (
        <StartScreen onStart={startGame} operationType={operationType} onReturnHome={onReturnHome} />
      )}
      {gameState === "playing" && (
        <GameScreen
          currentLevel={currentLevel}
          maxLevels={maxLevels}
          score={score}
          operationType={operationType}
          onNextLevel={goToNextLevel}
          onScoreChange={setScore}
          onReturnHome={onReturnHome}
        />
      )}
      {gameState === "end" && (
        <EndScreen score={score} gameType={operationType} onNextLevel={onNextLevel} onSelectLevel={onReturnHome} />
      )}
    </motion.div>
  );
};

export default ArithmeticGame;
