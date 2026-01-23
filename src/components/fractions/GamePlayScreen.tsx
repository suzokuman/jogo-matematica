
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Fraction from "./Fraction";
import FractionDropZone from "./FractionDropZone";
import PizzaFraction from "./PizzaFraction";
import { Button } from "@/components/ui/button";
import { getFractionRangeByGrade, generateNumberInRange } from "@/utils/gradeRanges";
import { saveScoreToLeaderboard, saveProgress } from "@/lib/supabase";

interface GamePlayScreenProps {
  currentLevel: number;
  maxLevels: number;
  score: number;
  fractionSequence: string[];
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  onReturnHome?: () => void;
}

const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  currentLevel,
  maxLevels,
  score,
  fractionSequence,
  onCorrectAnswer,
  onWrongAnswer,
  playCorrect,
  playWrong,
  onReturnHome
}) => {
  const [dropStatus, setDropStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [dropMessage, setDropMessage] = useState("Solte aqui a fração correta");
  const [options, setOptions] = useState<string[]>([]);

  const generateOptions = (correct: string) => {
    const options = new Set([correct]);
    const range = getFractionRangeByGrade();
    const [correctNum, correctDen] = correct.split("/").map(Number);
    const maxDiff = Math.max(2, Math.floor((range.max - range.min) / 4));
    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }
    function isEquivalent(n1: number, d1: number, n2: number, d2: number) {
      return n1 * d2 === n2 * d1;
    }
    while (options.size < 6) {
      let n = generateNumberInRange(range.min, range.max);
      let d = generateNumberInRange(range.min, range.max);
      if (n < d && d - n <= maxDiff) {
        // Evita frações equivalentes à correta
        if (isEquivalent(n, d, correctNum, correctDen)) continue;
        // Evita frações já presentes
        const fraction = `${n}/${d}`;
        if (!options.has(fraction)) {
          options.add(fraction);
        }
      }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (fractionSequence.length > 0) {
      const fraction = fractionSequence[currentLevel];
      console.log(`Current fraction: ${fraction}`);
      setOptions(generateOptions(fraction));
    }
  }, [currentLevel, fractionSequence]);

  const handleDrop = (value: string) => {
    const correctValue = fractionSequence[currentLevel];

    if (value === correctValue) {
      setDropStatus("correct");
      setDropMessage(`Correto! A fração é ${value}.`);
      playCorrect();
      onCorrectAnswer();
      
      setTimeout(() => {
        if (currentLevel + 1 >= fractionSequence.length) {
          // End game handled by parent
        } else {
          setDropStatus("idle");
          setDropMessage("Solte aqui a fração correta");
        }
      }, 1200);
    } else {
      setDropStatus("wrong");
      setDropMessage("Incorreto. Tente novamente.");
      playWrong();
      onWrongAnswer();
    }
  };

  if (fractionSequence.length === 0 || currentLevel >= fractionSequence.length) {
    return <div>Carregando...</div>;
  }

  return (
    <motion.div 
      className="container mx-auto py-8 px-4 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-4 rounded-xl shadow-md mb-4 w-full max-w-md mx-auto flex justify-between items-center">
        <div className="text-lg font-medium">
          <span className="text-game-primary">Nível {currentLevel + 1}</span> / {maxLevels}
        </div>
        <div className="text-lg font-semibold">
          Pontos: <span className={score >= 0 ? "text-game-correct" : "text-game-wrong"}>{score}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Jogo das Frações
        </h2>
        
        {onReturnHome && (
          <Button 
            variant="outline"
            onClick={async () => {
              await saveScoreToLeaderboard(score, "Frações");
              await saveProgress(score, "frações", currentLevel, maxLevels);
              if (onReturnHome) onReturnHome();
            }}
            className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
            size="sm"
          >
            Voltar
          </Button>
        )}
      </div>

      <PizzaFraction fraction={fractionSequence[currentLevel]} />

      <div className="w-full max-w-lg mb-6 mx-auto flex justify-center">
        <FractionDropZone 
          message={dropMessage} 
          status={dropStatus} 
          onDrop={handleDrop} 
        />
      </div>

      <div className="flex flex-wrap justify-center gap-16 my-12">
        {options.map((option, index) => (
          <Fraction key={index} value={option} onDragStart={() => {}} />
        ))}
      </div>
    </motion.div>
  );
};

export default GamePlayScreen;
