import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArithmeticProblem, { MissingPosition } from "./ArithmeticProblem";
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
  const [resultValue, setResultValue] = useState(0);
  const [missing, setMissing] = useState<MissingPosition>("result");
  const [options, setOptions] = useState<number[]>([]);
  const [dropStatus, setDropStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [dropMessage, setDropMessage] = useState("Solte aqui a resposta correta");

  const { playCorrect, playWrong } = useSoundEffects();

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const calculate = (a: number, b: number, tipo: string) => {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
    const grade = parseInt(playerInfo.grade || "1");
    switch (tipo) {
      case "soma": return a + b;
      case "subtracao": return a - b;
      case "multiplicacao": return a * b;
      case "divisao":
        if (grade >= 6) return parseFloat((a / b).toFixed(2));
        return a / b;
      default: return a + b;
    }
  };

  const generateOptionsWithCorrect = (correctAnswer: number, isDecimal: boolean): number[] => {
    const opts = new Set<number>([correctAnswer]);
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
    const grade = parseInt(playerInfo.grade || "1");

    let maxOption = 20;
    switch (grade) {
      case 1: maxOption = 18; break;
      case 2: maxOption = 40; break;
      case 3: case 4: maxOption = 100; break;
      case 5: case 6: maxOption = 200; break;
      default: maxOption = Math.max(Math.abs(correctAnswer) * 2, 100);
    }
    const minOption = correctAnswer < 0 ? -maxOption : 1;

    let attempts = 0;
    while (opts.size < 6 && attempts < 200) {
      attempts++;
      const strategy = Math.floor(Math.random() * 3);
      let option: number;
      switch (strategy) {
        case 0: {
          const offset = isDecimal
            ? parseFloat((Math.random() * 5 + 0.5).toFixed(2))
            : Math.floor(Math.random() * Math.min(10, maxOption / 4)) + 1;
          option = isDecimal
            ? parseFloat((correctAnswer + (Math.random() < 0.5 ? offset : -offset)).toFixed(2))
            : correctAnswer + (Math.random() < 0.5 ? offset : -offset);
          break;
        }
        case 1: {
          option = isDecimal
            ? parseFloat((Math.random() * maxOption + 1).toFixed(2))
            : Math.floor(Math.random() * (maxOption - minOption + 1)) + minOption;
          break;
        }
        default: {
          const factor = Math.random() < 0.5 ? 0.7 : 1.3;
          option = isDecimal
            ? parseFloat((correctAnswer * factor).toFixed(2))
            : Math.floor(correctAnswer * factor);
          break;
        }
      }
      if (option !== correctAnswer && option > 0 && Math.abs(option) <= maxOption * 2) {
        opts.add(option);
      }
    }
    // garantir 6 opções (fallback)
    let filler = 1;
    while (opts.size < 6) {
      const candidate = correctAnswer + filler;
      if (candidate > 0 && candidate !== correctAnswer) opts.add(candidate);
      filler++;
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  const handleDrop = (value: number) => {
    let correct: number;
    if (missing === "result") correct = resultValue;
    else if (missing === "num1") correct = num1;
    else correct = num2;

    // tolerância para decimais
    const isMatch = Math.abs(value - correct) < 0.005;

    if (isMatch) {
      setDropStatus("correct");
      setDropMessage(`Correto! 🚀 Resposta: ${value}`);
      playCorrect();
      onScoreChange(score + 1);
      setTimeout(() => {
        onNextLevel();
        setDropStatus("idle");
        setDropMessage("Solte aqui a resposta correta");
      }, 1200);
    } else {
      setDropStatus("wrong");
      setDropMessage(`Ops! Tente novamente. ⭐`);
      playWrong();
      onScoreChange(score - 1);
    }
  };

  const loadProblem = () => {
    const { num1: a, num2: b } = createGradeSpecificProblem(operationType);
    const correct = calculate(a, b, operationType);

    // Sortear posição faltante: 50% resultado, 25% num1, 25% num2
    const r = Math.random();
    let chosen: MissingPosition = "result";
    if (r < 0.5) chosen = "result";
    else if (r < 0.75) chosen = "num1";
    else chosen = "num2";

    // Para divisão decimal (>=6º) evitar pedir num1/num2 (resposta seria decimal estranha)
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
    const grade = parseInt(playerInfo.grade || "1");
    const isDivisionDecimal = operationType === "divisao" && grade >= 6;
    if (isDivisionDecimal) chosen = "result";

    setNum1(a);
    setNum2(b);
    setResultValue(correct);
    setMissing(chosen);

    const targetValue = chosen === "result" ? correct : (chosen === "num1" ? a : b);
    const isDecimal = isDivisionDecimal && chosen === "result";
    setOptions(generateOptionsWithCorrect(targetValue, isDecimal));
  };

  useEffect(() => {
    loadProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, operationType]);

  const missingLabel =
    missing === "result" ? "o resultado" : missing === "num1" ? "o primeiro número" : "o segundo número";

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cosmic-card !p-4 mb-4 w-full max-w-md flex justify-between items-center">
        <div className="text-lg font-medium">
          <span className="neon-text-pink">Nível {currentLevel + 1}</span>
          <span className="text-muted-foreground"> / {maxLevels}</span>
        </div>
        <div className="text-lg font-semibold">
          <span className="text-muted-foreground">Pontos: </span>
          <span className={score >= 0 ? "text-game-correct" : "text-game-wrong"}>{score}</span>
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          🚀 <span className="neon-text">Modo: {capitalize(operationType)}</span>
        </h1>

        {onReturnHome && (
          <Button
            variant="outline"
            onClick={async () => {
              await saveScoreToLeaderboard(score, operationType);
              await saveProgress(score, operationType, currentLevel, maxLevels);
              if (onReturnHome) onReturnHome();
            }}
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Voltar
          </Button>
        )}
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-2 text-center">
        Descubra <span className="neon-text font-bold">{missingLabel}</span> e arraste a resposta!
      </p>

      <ArithmeticProblem num1={num1} num2={num2} result={resultValue} operationType={operationType} missing={missing} />

      <div className="w-full max-w-lg mb-6">
        <DropZone onDrop={handleDrop} message={dropMessage} status={dropStatus} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <DraggableOption key={`${option}-${index}`} value={option} onDragStart={() => {}} />
        ))}
      </div>
    </motion.div>
  );
};

export default GameScreen;
