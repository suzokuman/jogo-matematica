import { getNumberRangeByGrade, generateNumberInRange, getMultDivRangeByGrade } from "../gradeRanges";

// 1º ANO: Números de 1 a 9 RIGOROSAMENTE
export const createGrade1Problem = (operationType: string): { num1: number, num2: number } => {
  let range = getNumberRangeByGrade();
  if (operationType === "multiplicacao" || operationType === "divisao") {
    range = getMultDivRangeByGrade();
  }
  let num1 = generateNumberInRange(range.min, range.max);
  let num2 = generateNumberInRange(range.min, range.max);

  if (operationType === "subtracao") {
    if (num1 < num2) [num1, num2] = [num2, num1];
  } else if (operationType === "divisao") {
    const maxDivisor = Math.floor(range.max / 2);
    const minDivisor = Math.max(range.min, 1);
    num2 = generateNumberInRange(minDivisor, Math.max(minDivisor, maxDivisor));
    const maxMultiplier = Math.max(2, Math.floor(range.max / num2));
    const multiplier = generateNumberInRange(2, maxMultiplier);
    num1 = num2 * multiplier;
  } else if (operationType === "multiplicacao") {
    num1 = generateNumberInRange(range.min, range.max);
    num2 = generateNumberInRange(range.min, range.max);
  }

  num1 = Math.max(range.min, Math.min(range.max, num1));
  num2 = Math.max(range.min, Math.min(range.max, num2));

  return { num1, num2 };
};
