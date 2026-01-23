
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import StartScreen from "./StartScreen";
import EndScreen from "./EndScreen";
import { useSoundEffects } from "./SoundEffects";
import LeaderboardTable, { LeaderboardEntry } from "./LeaderboardTable";
import GamePlayScreen from "./fractions/GamePlayScreen";
import { generateRandomFractionSequence, allFractions } from "./fractions/FractionGameUtils";
import { saveScoreToLeaderboard } from "@/lib/supabase";

interface FractionsGameProps {
  onReturnHome: () => void;
}

const FractionsGame = ({ onReturnHome }: FractionsGameProps) => {
  const [gameState, setGameState] = useState<"start" | "playing" | "end" | "leaderboard">("start");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const { playCorrect, playWrong } = useSoundEffects();
  
  // Estado para armazenar a sequência aleatória de frações
  const [fractionSequence, setFractionSequence] = useState<string[]>([]);
  const [usedFractions, setUsedFractions] = useState<string[]>([]);
  
  useEffect(() => {
    // Load leaderboard
    const entries = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaderboardEntries(entries);
  }, []);

  const startGame = () => {
    // Generate a random sequence of fractions when starting the game
    setFractionSequence(generateRandomFractionSequence(allFractions));
    setUsedFractions([]);
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
  };

  const endGame = () => {
    setGameState("end");
  };

  const restartGame = () => {
    setGameState("start");
  };
  
  const viewLeaderboard = () => {
    // Refresh leaderboard data
    const entries = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaderboardEntries(entries);
    setGameState("leaderboard");
  };

  const handleCorrectAnswer = () => {
    // Update score
    setScore(prevScore => prevScore + 1);
    
    // Add the current fraction to used fractions
    const currentFraction = fractionSequence[currentLevel];
    setUsedFractions(prev => [...prev, currentFraction]);
    
    // Advance to next level or end game if all levels complete
    setTimeout(() => {
      if (currentLevel + 1 >= fractionSequence.length) {
        endGame();
      } else {
        setCurrentLevel(prevLevel => prevLevel + 1);
      }
    }, 1200);
  };

  const handleWrongAnswer = () => {
    setScore(prevScore => prevScore - 1);
  };

  // Função para salvar score ao desistir
  const handleReturnHome = async () => {
    if (gameState === "playing" && score > 0) {
      await saveScoreToLeaderboard(score, "Frações");
    }
    onReturnHome();
  };

  if (gameState === "start") {
    return (
      <StartScreen onStart={startGame} operationType="frações" onReturnHome={onReturnHome} />
    );
  }

  if (gameState === "end") {
    return (
      <EndScreen 
        score={score} 
        onRestart={restartGame} 
        onViewLeaderboard={viewLeaderboard}
        gameType="frações"
        currentLevel={currentLevel}
        maxLevels={fractionSequence.length}
      />
    );
  }
  
  if (gameState === "leaderboard") {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-game-primary">Histórico de Pontuações</h2>
            <div className="flex gap-2">
              <Button 
                className="bg-game-secondary hover:bg-game-secondary/80"
                onClick={restartGame}
              >
                Voltar ao Jogo
              </Button>
              <Button 
                onClick={onReturnHome}
              >
                Página Inicial
              </Button>
            </div>
          </div>
          <LeaderboardTable entries={leaderboardEntries} />
        </div>
      </div>
    );
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
      onReturnHome={handleReturnHome}
    />
  );
};

export default FractionsGame;
