import { generateNumberInRange } from "../gradeRanges";

interface DivisionGeneratorParams {
  min: number;
  max: number;
  exact: boolean;
}

export const generateDivisionOperands = ({
  min,
  max,
  exact,
}: DivisionGeneratorParams): { num1: number; num2: number } => {
  const safeMin = Math.max(1, min);

  if (!exact) {
    const num1 = generateNumberInRange(safeMin, max);
    let num2 = generateNumberInRange(safeMin, max);

    while (num1 === num2) {
      num2 = generateNumberInRange(safeMin, max);
    }

    return { num1, num2 };
  }

  for (let attempt = 0; attempt < 1000; attempt++) {
    const num1 = generateNumberInRange(safeMin, max);
    const num2 = generateNumberInRange(safeMin, max);

    if (num1 !== num2 && num1 % num2 === 0) {
      return { num1, num2 };
    }
  }

  const fallbackDivisor = generateNumberInRange(
    safeMin,
    Math.max(safeMin, Math.floor(max / 2))
  );

  return {
    num1: fallbackDivisor * 2,
    num2: fallbackDivisor,
  };
};