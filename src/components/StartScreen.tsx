
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStart: () => void;
  operationType: string;
  onReturnHome?: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, operationType, onReturnHome }) => {
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const isFractions = operationType === "frações";

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-6xl mb-4 float-anim">{isFractions ? "🍕" : "🪐"}</div>
      <h1 className="text-3xl md:text-5xl font-bold neon-text-pink mb-6 text-center">
        {isFractions
          ? "Jogo das Frações"
          : `Jogo de Aritmética`}
      </h1>

      {!isFractions && (
        <p className="text-lg md:text-xl mb-4 max-w-xl text-center text-foreground">
          Modo: <span className="font-bold neon-text">{capitalize(operationType)}</span>
        </p>
      )}

      <div className="cosmic-card max-w-xl mb-8">
        {isFractions ? (
          <>
            <p className="text-lg mb-4">
              Você verá uma pizza dividida em partes. Arraste a fração correta que representa a parte pintada.
            </p>
            <p className="text-lg mb-4">
              São 20 níveis com dificuldade crescente.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg mb-4">
              ⭐ Resolva contas espaciais! Às vezes você descobre o resultado, outras vezes precisa achar o número que está faltando (ex: <span className="neon-text font-bold">12 + ? = 24</span>).
            </p>
            <p className="text-lg mb-4">
              Arraste a resposta correta para o quadro. São 20 níveis com dificuldade crescente.
            </p>
          </>
        )}
        <p className="font-semibold text-lg">
          Acertos valem <span className="text-game-correct">+1 ponto</span> e erros <span className="text-game-wrong">-1 ponto</span>.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="game-button animate-pulse-scale"
          onClick={onStart}
        >
          Começar o Jogo
        </Button>
        
        {onReturnHome && (
          <Button 
            variant="outline"
            onClick={onReturnHome}
            className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
          >
            Voltar para Início
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default StartScreen;
