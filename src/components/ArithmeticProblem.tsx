import { motion } from "framer-motion";

export type MissingPosition = "result" | "num1" | "num2";

interface ArithmeticProblemProps {
  num1: number;
  num2: number;
  result: number;
  operationType: string;
  missing: MissingPosition;
}

const ArithmeticProblem: React.FC<ArithmeticProblemProps> = ({ num1, num2, result, operationType, missing }) => {
  const getSymbol = (type: string) => {
    switch (type) {
      case "soma": return "+";
      case "subtracao": return "−";
      case "multiplicacao": return "×";
      case "divisao": return "÷";
      default: return "+";
    }
  };

  const symbol = getSymbol(operationType);
  const formatNum = (n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, '');
  const placeholder = (
    <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-xl bg-accent/20 border-2 border-dashed border-accent text-accent font-black animate-pulse">
      ?
    </span>
  );

  return (
    <motion.div
      className="text-4xl md:text-6xl font-bold my-8 p-6 md:p-8 cosmic-card text-foreground flex items-center justify-center flex-wrap gap-3"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      key={`${num1}-${num2}-${missing}`}
    >
      {missing === "num1" ? placeholder : <span className="neon-text-pink">{formatNum(num1)}</span>}
      <span className="neon-text mx-2">{symbol}</span>
      {missing === "num2" ? placeholder : <span className="neon-text-pink">{formatNum(num2)}</span>}
      <span className="neon-text mx-2">=</span>
      {missing === "result" ? placeholder : <span className="neon-text-pink">{formatNum(result)}</span>}
    </motion.div>
  );
};

export default ArithmeticProblem;
