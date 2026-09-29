import { useState } from "react";
import StartScreen from "./StartScreen";
import EndScreen from "./EndScreen";
import { useSoundEffects } from "./SoundEffects";
import GamePlayScreen from "./fractions/GamePlayScreen";
import { generateRandomFractionSequence, allFractions } from "./fractions/FractionGameUtils";
import { recordProgress } from "@/lib/progress";

interface FractionsGameProps {
  onReturnHome: () => void;
  onNextLevel: () => void;
}

const FractionsGame = ({ onReturnHome, onNextLevel }: FractionsGameProps) => {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const { playCorrect, playWrong } = useSoundEffects();
  const [fractionSequence, setFractionSequence] = useState<string[]>([]);

  const startGame = () => {
    setFractionSequence(generateRandomFractionSequence(allFractions));
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
  };

  const handleCorrectAnswer = () => {
    const newScore = score + 1;
    setScore(newScore);
    recordProgress("frações", currentLevel + 1, newScore);
    setTimeout(() => {
      if (currentLevel + 1 >= fractionSequence.length) setGameState("end");
      else setCurrentLevel((prev) => prev + 1);
    }, 1200);
  };

  const handleWrongAnswer = () => setScore((prev) => prev - 1);

  if (gameState === "start") {
    return <StartScreen onStart={startGame} operationType="frações" onReturnHome={onReturnHome} />;
  }

  if (gameState === "end") {
    return <EndScreen score={score} gameType="frações" onNextLevel={onNextLevel} onSelectLevel={onReturnHome} />;
  }

  return (
    <GamePlayScreen
      currentLevel={currentLevel}
      maxLevels={fractionSequence.length}
      score={score}
      fractionSequence={fractionSequence}
      onCorrectAnswer={handleCorrectAnswer}
      onWrongAnswer={handleWrongAnswer}
      playCorrect={playCorrect}
      playWrong={playWrong}
      onReturnHome={onReturnHome}
    />
  );
};

export default FractionsGame;
