
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameSelectionProps {
  playerName: string;
  playerGrade: string;
  onStartFractions: () => void;
  onStartArithmetic: (tipo: string) => void;
  onViewLeaderboard: () => void;
  onChangeLevel: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({
  playerName,
  playerGrade,
  onStartFractions,
  onStartArithmetic,
  onViewLeaderboard,
  onChangeLevel,
}) => {
  const [showArithmeticMenu, setShowArithmeticMenu] = useState(false);

  const toggleArithmeticMenu = () => {
    setShowArithmeticMenu(prev => !prev);
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <p className="text-xl mb-2">
        Olá, <span className="font-bold">{playerName}</span> — <span className="font-bold">Nível {playerGrade}</span>!
      </p>
      <p className="text-lg mb-4">Escolha um jogo para começar:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button 
          className="game-button py-6 text-xl"
          onClick={onStartFractions}
        >
          Frações
        </Button>
        
        <Button 
          className="game-button py-6 text-xl"
          onClick={toggleArithmeticMenu}
        >
          Aritmética Básica
        </Button>
      </div>
      
      {showArithmeticMenu && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {["soma", "subtracao", "multiplicacao", "divisao"].map((tipo) => (
            <Button 
              key={tipo}
              className="bg-game-secondary hover:bg-game-primary text-white py-4"
              onClick={() => onStartArithmetic(tipo)}
            >
              {tipo === "soma" && "Soma"}
              {tipo === "subtracao" && "Subtração"}
              {tipo === "multiplicacao" && "Multiplicação"}
              {tipo === "divisao" && "Divisão"}
            </Button>
          ))}
        </motion.div>
      )}
      
      <div className="flex gap-4 mt-4">
        <Button 
          variant="outline"
          onClick={onChangeLevel}
          className="border-game-secondary text-game-secondary hover:bg-game-secondary hover:text-white"
        >
          Mudar Nível
        </Button>
        <Button 
          variant="outline"
          onClick={onViewLeaderboard}
        >
          Ver Histórico de Pontuações (Admin)
        </Button>
      </div>
    </motion.div>
  );
};

export default GameSelection;
