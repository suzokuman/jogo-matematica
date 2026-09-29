import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Confetti } from "./Confetti";
import { getCurrentLevel } from "@/lib/progress";

interface EndScreenProps {
  score: number;
  gameType: string;
  onNextLevel: () => void;
  onSelectLevel: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, gameType, onNextLevel, onSelectLevel }) => {
  const level = getCurrentLevel();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Confetti />
      <div className="flex gap-3 text-6xl md:text-7xl mb-4">
        <span className="float-anim">🏆</span>
        <span className="float-anim" style={{ animationDelay: "0.3s" }}>🎉</span>
        <span className="float-anim" style={{ animationDelay: "0.6s" }}>🌟</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold rainbow-text mb-6 text-center">Parabéns, Astronauta! 🚀</h1>

      <div className="cosmic-card max-w-lg mb-8 w-full text-center">
        <p className="text-xl mb-4">
          Você concluiu o Nível {level} de {gameType === "frações" ? "Frações" : "Aritmética"}!
        </p>
        <p className="text-2xl font-bold mb-6">
          Sua pontuação:
          <span className={`block text-4xl mt-3 ${score > 10 ? "text-game-correct" : "text-game-wrong"}`}>
            {score} pontos ⭐
          </span>
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {level < 9 && (
            <Button className="game-button" onClick={onNextLevel}>
              Próximo Nível ➡️
            </Button>
          )}
          <Button variant="outline" onClick={onSelectLevel}>
            Selecionar Novo Nível
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EndScreen;
