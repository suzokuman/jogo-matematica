
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ncuvweswnvoisjgaecnh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXZ3ZXN3bnZvaXNqZ2FlY25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjA4NTUsImV4cCI6MjA1OTk5Njg1NX0.brNUm4P63OjZfE_B2hBwvrazLmg3q-K7IxmKWRyjIJY";

// Criar o cliente Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export type LeaderboardEntryDB = {
  id?: number;
  name: string;
  grade: string;
  score: number;
  game_type: string;
  created_at?: string;
};

export async function getLeaderboardEntries(): Promise<LeaderboardEntryDB[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar pontuações:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro ao carregar pontuações:', err);
    return [];
  }
}

export async function saveLeaderboardEntry(entry: Omit<LeaderboardEntryDB, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leaderboard')
      .insert([entry]);
    
    if (error) {
      console.error('Erro ao salvar pontuação:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao salvar pontuação:', err);
    return false;
  }
}

// Função utilitária para salvar score (usada ao finalizar ou desistir do jogo)
export async function saveScoreToLeaderboard(score: number, gameType: string): Promise<boolean> {
  const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
  if (!playerInfo.name || !playerInfo.grade) return false;

  const newEntry: LeaderboardEntryDB = {
    name: playerInfo.name,
    grade: playerInfo.grade,
    score,
    game_type: gameType,
  };

  // Salva localmente também
  const leaderboardEntries: any[] = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboardEntries.push({ ...newEntry, date: new Date().toLocaleDateString("pt-BR") });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardEntries));

  // Salva no Supabase
  return await saveLeaderboardEntry({
    name: playerInfo.name,
    grade: playerInfo.grade,
    score,
    game_type: gameType
  });
}

// Tipo para entrada de progresso
export type ProgressEntryDB = {
  nome: string;
  grade: string;
  score: number;
  game_type: string;
  Level: string;
};

// Função para salvar progresso na tabela progress
export async function saveProgress(
  score: number, 
  gameType: string, 
  currentLevel: number, 
  maxLevels: number
): Promise<boolean> {
  try {
    const playerInfo = JSON.parse(localStorage.getItem("playerInfo") || "{}");
    if (!playerInfo.name || !playerInfo.grade) {
      console.error('Informações do jogador não encontradas');
      return false;
    }

    // Formatar o tipo de jogo
    const formattedGameType = gameType === "frações" ? "Frações" : 
                              gameType === "soma" ? "Soma" :
                              gameType === "subtracao" ? "Subtração" :
                              gameType === "multiplicacao" ? "Multiplicação" :
                              gameType === "divisao" ? "Divisão" : gameType;

    // Criar string do nível (ex: "20/20" ou "8/20")
    const levelString = `${currentLevel + 1}/${maxLevels}`;

    // Preparar dados para inserção
    const progressEntry = {
      nome: playerInfo.name,
      grade: playerInfo.grade,
      score: score,
      game_type: formattedGameType,
      Level: levelString
    };

    // Inserir na tabela progress
    const { error } = await supabase
      .from('progress')
      .insert([progressEntry]);

    if (error) {
      console.error('Erro ao salvar progresso:', error);
      return false;
    }

    console.log('Progresso salvo com sucesso:', progressEntry);
    return true;
  } catch (err) {
    console.error('Erro ao salvar progresso:', err);
    return false;
  }
}
