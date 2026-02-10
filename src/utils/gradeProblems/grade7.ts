import { getNumberRangeByGrade, generateNumberInRange, getMultDivRangeByGrade } from "../gradeRanges";

// 7º ANO: Números de 1 a 150
export const createGrade7Problem = (operationType: string): { num1: number, num2: number } => {
  let range = getNumberRangeByGrade();
  if (operationType === "multiplicacao" || operationType === "divisao") {
    range = getMultDivRangeByGrade();
  }
  let num1 = generateNumberInRange(range.min, range.max);
  let num2 = generateNumberInRange(range.min, range.max);

  if (operationType === "subtracao") {
    if (num1 < num2) [num1, num2] = [num2, num1];
  } else if (operationType === "divisao") {
    num2 = generateNumberInRange(range.min, range.max);
    const resultado = generateNumberInRange(range.min, range.max);
    num1 = num2 * resultado;
  } else if (operationType === "multiplicacao") {
    num1 = generateNumberInRange(range.min, range.max);
    num2 = generateNumberInRange(range.min, range.max);
  }

  num1 = Math.max(range.min, Math.min(range.max, num1));
  num2 = Math.max(range.min, Math.min(range.max, num2));

  return { num1, num2 };
};
