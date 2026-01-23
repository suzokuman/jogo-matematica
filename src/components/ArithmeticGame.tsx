
import { useState, useEffect } from "react";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import EndScreen from "./EndScreen";
import SoundEffects from "./SoundEffects";
import { motion } from "framer-motion";
import LeaderboardTable, { LeaderboardEntry } from "./LeaderboardTable";
import { Button } from "@/components/ui/button";
import { getLeaderboardEntries, LeaderboardEntryDB, saveScoreToLeaderboard } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ArithmeticGameProps {
  initialOperationType?: string;
  onReturnHome: () => void;
}

const ArithmeticGame = ({ initialOperationType, onReturnHome }: ArithmeticGameProps) => {
  const [gameState, setGameState] = useState<"start" | "playing" | "end" | "leaderboard">("start");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [operationType, setOperationType] = useState(initialOperationType || "soma");
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const maxLevels = 20;

  useEffect(() => {
    // Verificar se há um tipo de operação na URL
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo") || initialOperationType || "soma";
    setOperationType(tipo);
  }, [initialOperationType]);

  const loadLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboardEntries();
      
      // Definir um formato consistente para as entradas da tabela
      let formattedEntries: LeaderboardEntry[];

      // Se vieram do banco, formatar as datas
      if (data.length > 0 && 'created_at' in data[0]) {
        formattedEntries = data.map((entry: LeaderboardEntryDB) => ({
          id: entry.id,
          name: entry.name,
          grade: entry.grade,
          score: entry.score,
          gameType: entry.game_type,
          date: entry.created_at 
            ? format(new Date(entry.created_at), "dd/MM/yyyy", { locale: ptBR })
            : format(new Date(), "dd/MM/yyyy", { locale: ptBR })
        }));
      } else {
        // Caso contrário, assumimos que já estão no formato local
        formattedEntries = data as unknown as LeaderboardEntry[];
      }
      
      setLeaderboardEntries(formattedEntries);
    } catch (error) {
      console.error("Erro ao carregar pontuações:", error);
      // Fallback para localStorage se houver erro
      const entries = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      setLeaderboardEntries(entries);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(0);
    setScore(0);
  };

  const goToNextLevel = () => {
    if (currentLevel + 1 >= maxLevels) {
      setGameState("end");
    } else {
      setCurrentLevel(prev => prev + 1);
    }
  };

  const restartGame = () => {
    setGameState("start");
  };
  
  const viewLeaderboard = async () => {
    await loadLeaderboardData();
    setGameState("leaderboard");
  };

  // Função para salvar score ao desistir
  const handleReturnHome = async () => {
    if (gameState === "playing" && score > 0) {
      await saveScoreToLeaderboard(score, operationType);
    }
    onReturnHome();
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
          onReturnHome={handleReturnHome}
        />
      )}
      
      {gameState === "end" && (
        <EndScreen 
          score={score} 
          onRestart={restartGame} 
          onViewLeaderboard={viewLeaderboard}
          gameType={operationType}
          currentLevel={currentLevel}
          maxLevels={maxLevels}
        />
      )}
      
      {gameState === "leaderboard" && (
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
          <LeaderboardTable entries={leaderboardEntries} isLoading={isLoading} />
        </div>
      )}
    </motion.div>
  );
};

export default ArithmeticGame;
