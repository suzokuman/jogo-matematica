import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArithmeticProblem from "./ArithmeticProblem";
import DraggableOption from "./DraggableOption";
import DropZone from "./DropZone";
import { useSoundEffects } from "./SoundEffects";
import { Button } from "@/components/ui/button";
import { createGradeSpecificProblem } from "@/utils/gradeProblems";
import { saveScoreToLeaderboard, saveProgress } from "@/lib/supabase";

interface GameScreenProps {
  currentLevel: number;
  maxLevels: number;
  score: number;
  operationType: string;
  onNextLevel: () => void;
  onScoreChange: (newScore: number) => void;
  onReturnHome?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  currentLevel,
  maxLevels,
  score,
  operationType,
  onNextLevel,
  onScoreChange,
  onReturnHome
}) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [dropStatus, setDropStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [dropMessage, setDropMessage] = useState("Solte aqui a resposta correta");
  
  const { playCorrect, playWrong } = useSoundEffects();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Calculate correct answer
  const calculate = (a: number, b: number, tipo: string) => {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
    const grade = parseInt(playerInfo.grade || "1");
    
    switch (tipo) {
      case "soma": return a + b;
      case "subtracao": return a - b;
      case "multiplicacao": return a * b;
      case "divisao": 
        if (grade >= 7) {
          // Níveis 7-9: resultado com até 2 casas decimais
          return parseFloat((a / b).toFixed(2));
        }
        return a / b; // Níveis 1-6: divisão exata garantida pela geração
      default: return a + b;
    }
  };

  // Gerar opções adequadas por série
  const generateOptionsWithCorrect = (correctAnswer: number): number[] => {
    const options = new Set<number>([correctAnswer]);
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
    const grade = parseInt(playerInfo.grade || "1");
    const isDecimal = grade >= 7 && operationType === "divisao";
    
    let minOption = 1;
    let maxOption = 20;
    
    switch (grade) {
      case 1: maxOption = 18; break;
      case 2: maxOption = 40; break;
      case 3: case 4: maxOption = 100; break;
      case 5: case 6: maxOption = 200; break;
      default: maxOption = Math.max(correctAnswer * 2, 100);
    }
    
    while (options.size < 6) {
      let option: number;
      const strategy = Math.floor(Math.random() * 3);
      
      switch (strategy) {
        case 0:
          const offset = isDecimal 
            ? parseFloat((Math.random() * 5 + 0.5).toFixed(2))
            : Math.floor(Math.random() * Math.min(10, maxOption / 4)) + 1;
          option = isDecimal
            ? parseFloat((correctAnswer + (Math.random() < 0.5 ? offset : -offset)).toFixed(2))
            : correctAnswer + (Math.random() < 0.5 ? offset : -offset);
          break;
        case 1:
          option = isDecimal
            ? parseFloat((Math.random() * maxOption + minOption).toFixed(2))
            : Math.floor(Math.random() * (maxOption - minOption + 1)) + minOption;
          break;
        default:
          const factor = Math.random() < 0.5 ? 0.7 : 1.3;
          option = isDecimal
            ? parseFloat((correctAnswer * factor).toFixed(2))
            : Math.floor(correctAnswer * factor);
          break;
      }
      
      if (option >= minOption && option <= maxOption && option !== correctAnswer && option > 0) {
        options.add(option);
      }
    }
    
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const handleDrop = (value: number) => {
    const correct = calculate(num1, num2, operationType);

    if (value === correct) {
      setDropStatus("correct");
      setDropMessage(`Correto! Resposta: ${value}`);
      playCorrect();
      onScoreChange(score + 1);
      
      setTimeout(() => {
        onNextLevel();
        setDropStatus("idle");
        setDropMessage("Solte aqui a resposta correta");
      }, 1200);
    } else {
      setDropStatus("wrong");
      setDropMessage(`Incorreto. Tente novamente.`);
      playWrong();
      onScoreChange(score - 1);
    }
  };

  const loadProblem = () => {
    console.log(`CARREGANDO PROBLEMA PARA OPERAÇÃO: ${operationType}`);
    
    // Usar APENAS a função específica por série
    const { num1: a, num2: b } = createGradeSpecificProblem(operationType);
    
    setNum1(a);
    setNum2(b);
    
    const correct = calculate(a, b, operationType);
    console.log(`PROBLEMA CARREGADO: ${a} ${operationType} ${b} = ${correct}`);
    
    // Gerar opções apropriadas para a série
    setOptions(generateOptionsWithCorrect(correct));
  };

  // Carrega um novo problema quando o nível avança
  useEffect(() => {
    loadProblem();
  }, [currentLevel, operationType]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-4 rounded-xl shadow-md mb-4 w-full max-w-md flex justify-between items-center">
        <div className="text-lg font-medium">
          <span className="text-game-primary">Nível {currentLevel + 1}</span> / {maxLevels}
        </div>
        <div className="text-lg font-semibold">
          Pontos: <span className={score >= 0 ? "text-game-correct" : "text-game-wrong"}>{score}</span>
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Modo: {capitalize(operationType)}
        </h1>
        
        {onReturnHome && (
          <Button 
            variant="outline"
            onClick={async () => {
              await saveScoreToLeaderboard(score, operationType);
              await saveProgress(score, operationType, currentLevel, maxLevels);
              if (onReturnHome) onReturnHome();
            }}
            className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
            size="sm"
          >
            Voltar
          </Button>
        )}
      </div>

      <ArithmeticProblem num1={num1} num2={num2} operationType={operationType} />
      
      <div className="w-full max-w-lg mb-6">
        <DropZone 
          onDrop={handleDrop} 
          message={dropMessage} 
          status={dropStatus}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <DraggableOption 
            key={index} 
            value={option} 
            onDragStart={() => {}}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default GameScreen;
