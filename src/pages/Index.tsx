
import { useEffect, useState } from "react";
import ArithmeticGame from "../components/ArithmeticGame";
import FractionsGame from "../components/FractionsGame";
import { motion } from "framer-motion";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import PlayerForm from "@/components/PlayerForm";
import GameSelection from "@/components/GameSelection";
import LeaderboardView from "@/components/LeaderboardView";
import { usePlayerInfo } from "@/hooks/usePlayerInfo";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const Index = () => {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [operationType, setOperationType] = useState("soma");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const { playerInfo, savePlayerInfo, clearPlayerInfo } = usePlayerInfo();
  const { leaderboardEntries, isLoading, loadLeaderboardData, clearLeaderboard } = useLeaderboard();

  useEffect(() => {
    document.title = "Jogo Educativo de Matemática";
  }, []);

  const startFractions = () => {
    setSelectedGame("fractions");
    setShowStartScreen(false);
  };

  const startArithmetic = (tipo: string) => {
    setOperationType(tipo);
    setSelectedGame("arithmetic");
    setShowStartScreen(false);
  };
  
  const returnToHome = () => {
    setSelectedGame(null);
    setShowStartScreen(true);
    setShowLeaderboard(false);
  };
  
  const handleViewLeaderboard = () => {
    setShowAdminModal(true);
  };

  const handleAdminSuccess = async () => {
    setShowAdminModal(false);
    await loadLeaderboardData();
    setShowLeaderboard(true);
  };

  if (selectedGame === "arithmetic") {
    return (
      <div className="bg-transparent min-h-screen">
        <ArithmeticGame initialOperationType={operationType} onReturnHome={returnToHome} />
      </div>
    );
  }

  if (selectedGame === "fractions") {
    return (
      <div className="bg-transparent min-h-screen">
        <FractionsGame onReturnHome={returnToHome} />
      </div>
    );
  }
  
  if (showLeaderboard) {
    return (
      <LeaderboardView
        entries={leaderboardEntries}
        isLoading={isLoading}
        onReturnHome={returnToHome}
        onClearLeaderboard={clearLeaderboard}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <motion.div
        className="max-w-3xl w-full cosmic-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl md:text-7xl mb-3 float-anim">🚀</div>
          <h1 className="text-3xl md:text-5xl font-bold neon-text-pink">
            Aventura Matemática Espacial
          </h1>
          <p className="text-muted-foreground mt-2">Explore o universo dos números!</p>
        </motion.div>
        
        {!playerInfo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <PlayerForm onSubmitPlayerInfo={savePlayerInfo} />
          </motion.div>
        ) : (
          <GameSelection
            playerName={playerInfo.name}
            playerGrade={playerInfo.grade}
            onStartFractions={startFractions}
            onStartArithmetic={startArithmetic}
            onViewLeaderboard={handleViewLeaderboard}
            onChangeLevel={clearPlayerInfo}
          />
        )}
      </motion.div>
      
      <AdminPasswordModal 
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
};

export default Index;
