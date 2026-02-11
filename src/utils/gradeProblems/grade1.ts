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
    // Gerar divisão variada: escolher divisor e resultado aleatórios dentro do range
    num2 = generateNumberInRange(range.min, range.max);
    const resultado = generateNumberInRange(range.min, range.max);
    num1 = num2 * resultado;
  } else if (operationType === "multiplicacao") {
    num1 = generateNumberInRange(range.min, range.max);
    num2 = generateNumberInRange(range.min, range.max);
  }

  if (operationType !== "divisao") {
    num1 = Math.max(range.min, Math.min(range.max, num1));
    num2 = Math.max(range.min, Math.min(range.max, num2));
  }

  return { num1, num2 };
};
