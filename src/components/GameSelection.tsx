import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { getLevelSummary } from "@/lib/progress";

interface GameSelectionProps {
  selectedLevel: number;
  onSelectLevel: (level: number) => void;
  onStartFractions: () => void;
  onStartArithmetic: (tipo: string) => void;
  onNewGame: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({
  selectedLevel,
  onSelectLevel,
  onStartFractions,
  onStartArithmetic,
  onNewGame,
}) => {
  const [showArithmeticMenu, setShowArithmeticMenu] = useState(false);

  return (
    <motion.div className="flex flex-col gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="text-lg">🎯 Selecione o Nível:</p>
        <Button
          variant="outline"
          onClick={() => {
            if (window.confirm("Começar um novo jogo? Todo o progresso será apagado.")) onNewGame();
          }}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold"
        >
          🔄 NOVO JOGO
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
          const { percent, score } = getLevelSummary(level);
          const active = level === selectedLevel;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelectLevel(level)}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                active ? "border-primary bg-primary/15 scale-[1.01]" : "border-border bg-card/40 hover:border-primary/60"
              }`}
            >
              <div className="flex justify-between items-center mb-2 gap-2">
                <span className="font-bold text-lg">
                  {active ? "⭐ " : ""}Nível {level}
                </span>
                <span className="text-sm font-semibold">
                  {percent}% · {score} pontos
                </span>
              </div>
              <Progress value={percent} className="h-3" />
            </button>
          );
        })}
      </div>

      {selectedLevel > 0 ? (
        <>
          <p className="text-lg">
            🎮 Escolha um jogo para o <span className="font-bold neon-text">Nível {selectedLevel}</span>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button className="game-button py-6 text-xl" onClick={onStartFractions}>
              🍕 Frações
            </Button>
            <Button className="game-button py-6 text-xl" onClick={() => setShowArithmeticMenu((p) => !p)}>
              ➕ Aritmética Básica
            </Button>
          </div>
          {showArithmeticMenu && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { tipo: "soma", emoji: "➕", label: "Soma" },
                { tipo: "subtracao", emoji: "➖", label: "Subtração" },
                { tipo: "multiplicacao", emoji: "✖️", label: "Multiplicação" },
                { tipo: "divisao", emoji: "➗", label: "Divisão" },
              ].map(({ tipo, emoji, label }) => (
                <Button key={tipo} className="game-button py-4" onClick={() => onStartArithmetic(tipo)}>
                  {emoji} {label}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground">Clique em um nível para começar.</p>
      )}
    </motion.div>
  );
};

export default GameSelection;
