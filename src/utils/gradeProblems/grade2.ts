import { getNumberRangeByGrade, generateNumberInRange, getMultDivRangeByGrade, getDivisionRangeByGrade } from "../gradeRanges";

// 2º ANO: Divisão com números de 1 a 20, resultado exato
export const createGrade2Problem = (operationType: string): { num1: number, num2: number } => {
  let range = getNumberRangeByGrade();
  if (operationType === "multiplicacao") {
    range = getMultDivRangeByGrade();
  }
  let num1 = generateNumberInRange(range.min, range.max);
  let num2 = generateNumberInRange(range.min, range.max);

  if (operationType === "subtracao") {
    if (num1 < num2) [num1, num2] = [num2, num1];
  } else if (operationType === "divisao") {
    const divRange = getDivisionRangeByGrade();
    num2 = generateNumberInRange(2, Math.min(10, divRange.max));
    const maxResultado = Math.max(2, Math.floor(divRange.max / num2));
    const resultado = generateNumberInRange(2, maxResultado);
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
