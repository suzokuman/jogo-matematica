
// Este arquivo agora serve apenas para compatibilidade
// A lógica principal foi movida para gradeSpecificProblems.ts

export interface NumberRange {
  min: number;
  max: number;
}

// Função mantida apenas para compatibilidade com código existente
export const getNumberRangeByGrade = (): NumberRange => {
  const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
  const grade = parseInt(playerInfo.grade || "1");
  
  console.log(`Getting number range for grade: ${grade}`);
  
  switch (grade) {
    case 1: return { min: 1, max: 9 };
    case 2: return { min: 1, max: 20 };
    case 3: 
    case 4: return { min: 1, max: 50 };
    case 5: 
    case 6: return { min: 1, max: 99 };
    case 7: return { min: 1, max: 150 };
    case 8: return { min: 100, max: 999 };
    case 9: return { min: 100, max: 9999 };
    default: return { min: 1, max: 9 };
  }
};

// Função específica para range de frações
export const getFractionRangeByGrade = (): NumberRange => {
  const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
  const grade = parseInt(playerInfo.grade || "1");

  switch (grade) {
    case 1: return { min: 1, max: 5 };
    case 2: return { min: 1, max: 10 };
    case 3:
    case 4: return { min: 1, max: 15 };
    case 5:
    case 6: return { min: 1, max: 20 };
    case 7: return { min: 1, max: 25 };
    case 8: return { min: 1, max: 30 };
    case 9: return { min: 1, max: 35 };
    default: return { min: 1, max: 5 };
  }
};

// Função específica para range de multiplicação e divisão
export const getMultDivRangeByGrade = (): NumberRange => {
  const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
  const grade = parseInt(playerInfo.grade || "1");

  switch (grade) {
    case 1: return { min: 1, max: 5 };
    case 2: return { min: 1, max: 10 };
    case 3: return { min: 5, max: 15 };
    case 4: return { min: 1, max: 30 };
    case 5: return { min: 5, max: 40 };
    case 6: return { min: 5, max: 50 };
    case 7: return { min: 5, max: 70 };
    case 8: return { min: 10, max: 99 };
    case 9: return { min: 10, max: 99 };
    default: return { min: 1, max: 5 };
  }
};

// Função específica para range de divisão
export const getDivisionRangeByGrade = (): NumberRange => {
  const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
  const grade = parseInt(playerInfo.grade || "1");

  switch (grade) {
    case 1: return { min: 1, max: 10 };
    case 2: return { min: 1, max: 20 };
    case 3: return { min: 1, max: 30 };
    case 4: return { min: 1, max: 50 };
    case 5: return { min: 1, max: 60 };
    case 6: return { min: 1, max: 99 };
    case 7: return { min: 1, max: 150 };
    case 8: return { min: 1, max: 500 };
    case 9: return { min: 1, max: 2000 };
    default: return { min: 1, max: 10 };
  }
};

// Adding the missing generateNumberInRange function for compatibility
export const generateNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
