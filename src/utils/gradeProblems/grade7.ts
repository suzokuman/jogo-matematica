import { getNumberRangeByGrade, generateNumberInRange, getMultDivRangeByGrade, getDivisionRangeByGrade } from "../gradeRanges";

// 7º ANO: Divisão pode ser não exata (decimais permitidos)
export const createGrade7Problem = (operationType: string): { num1: number, num2: number } => {
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
    // Níveis 7+: mistura de divisões exatas e não exatas
    do {
      num1 = generateNumberInRange(2, divRange.max);
      num2 = generateNumberInRange(2, Math.min(50, divRange.max));
    } while (num1 === num2);
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
