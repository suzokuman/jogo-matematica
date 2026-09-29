// Progresso salvo apenas localmente (sem banco de dados)
export const GAME_MODES = ["soma", "subtracao", "multiplicacao", "divisao", "frações"] as const;
export const QUESTIONS_PER_GAME = 20;
const KEY = "pm_progress";

type ModeProgress = { answered: number; score: number };
type Progress = Record<string, Record<string, ModeProgress>>;

const read = (): Progress => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

export const getCurrentLevel = (): number =>
  parseInt(JSON.parse(localStorage.getItem("playerInfo") || "{}").grade || "0");

export const setCurrentLevel = (level: number) =>
  localStorage.setItem("playerInfo", JSON.stringify({ grade: String(level) }));

export const recordProgress = (mode: string, answered: number, score: number) => {
  const level = getCurrentLevel();
  if (!level) return;
  const p = read();
  const lv = (p[level] ||= {});
  const prev = lv[mode] || { answered: 0, score: 0 };
  lv[mode] = {
    answered: Math.min(QUESTIONS_PER_GAME, Math.max(prev.answered, answered)),
    score: Math.max(prev.score, score),
  };
  localStorage.setItem(KEY, JSON.stringify(p));
};

export const getLevelSummary = (level: number) => {
  const lv = read()[level] || {};
  const answered = GAME_MODES.reduce((s, m) => s + (lv[m]?.answered || 0), 0);
  const score = GAME_MODES.reduce((s, m) => s + (lv[m]?.score || 0), 0);
  return { percent: Math.round((answered / (GAME_MODES.length * QUESTIONS_PER_GAME)) * 100), score };
};

export const resetProgress = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem("playerInfo");
};
