
import React from "react";
import { Button } from "@/components/ui/button";
import LeaderboardTable, { LeaderboardEntry } from "@/components/LeaderboardTable";

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  onReturnHome: () => void;
  onClearLeaderboard: () => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  isLoading,
  onReturnHome,
  onClearLeaderboard
}) => {
  return (
    <div className="bg-transparent min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-game-primary">Histórico de Pontuações</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={onClearLeaderboard}
              >
                Limpar Histórico Local
              </Button>
              <Button onClick={onReturnHome}>
                Voltar
              </Button>
            </div>
          </div>
          
          <LeaderboardTable entries={entries} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;
