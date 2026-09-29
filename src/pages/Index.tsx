import { useEffect, useState } from "react";
import ArithmeticGame from "../components/ArithmeticGame";
import FractionsGame from "../components/FractionsGame";
import { motion } from "framer-motion";
import GameSelection from "@/components/GameSelection";
import { getCurrentLevel, resetProgress, setCurrentLevel } from "@/lib/progress";

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [operationType, setOperationType] = useState("soma");
  const [level, setLevel] = useState<number>(getCurrentLevel());
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    document.title = "Pense Matemática";
  }, []);

  const selectLevel = (l: number) => {
    setCurrentLevel(l);
    setLevel(l);
  };

  const returnToHome = () => setSelectedGame(null);

  const nextLevel = () => {
    selectLevel(Math.min(9, level + 1));
    setRunKey((k) => k + 1);
  };

  const newGame = () => {
    resetProgress();
    setLevel(0);
  };

  if (selectedGame === "arithmetic") {
    return (
      <div className="bg-transparent min-h-screen">
        <ArithmeticGame key={runKey} initialOperationType={operationType} onReturnHome={returnToHome} onNextLevel={nextLevel} />
      </div>
    );
  }

  if (selectedGame === "fractions") {
    return (
      <div className="bg-transparent min-h-screen">
        <FractionsGame key={runKey} onReturnHome={returnToHome} onNextLevel={nextLevel} />
      </div>
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
        <div className="text-center mb-6">
          <div className="flex justify-center gap-3 text-5xl md:text-6xl mb-3">
            <span className="float-anim">🧠</span>
            <span className="float-anim" style={{ animationDelay: "0.5s" }}>✨</span>
            <span className="float-anim" style={{ animationDelay: "1s" }}>🚀</span>
            <span className="float-anim" style={{ animationDelay: "1.5s" }}>🌟</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold rainbow-text">Pense Matemática</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            <span className="wiggle-anim">🎉</span> Aprenda brincando no universo dos números!{" "}
            <span className="wiggle-anim">🎈</span>
          </p>
        </div>

        <GameSelection
          selectedLevel={level}
          onSelectLevel={selectLevel}
          onStartFractions={() => {
            setRunKey((k) => k + 1);
            setSelectedGame("fractions");
          }}
          onStartArithmetic={(tipo) => {
            setOperationType(tipo);
            setRunKey((k) => k + 1);
            setSelectedGame("arithmetic");
          }}
          onNewGame={newGame}
        />
      </motion.div>
    </div>
  );
};

export default Index;
