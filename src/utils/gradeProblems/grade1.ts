import { getNumberRangeByGrade, generateNumberInRange, getMultDivRangeByGrade, getDivisionRangeByGrade } from "../gradeRanges";
import { generateDivisionOperands } from "./divisionUtils";

// 1º ANO: Divisão com números de 1 a 10, resultado exato
export const createGrade1Problem = (operationType: string): { num1: number, num2: number } => {
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
    ({ num1, num2 } = generateDivisionOperands({
      min: divRange.min,
      max: divRange.max,
      exact: true,
    }));
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
