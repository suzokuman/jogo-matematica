
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface LeaderboardEntry {
  id?: number;
  name: string;
  grade: string;
  score: number;
  gameType: string;
  date: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, isLoading = false }) => {
  return (
    <Table>
      <TableCaption>Histórico de Pontuações</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Nível</TableHead>
          <TableHead>Jogo</TableHead>
          <TableHead>Pontuação</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">Carregando pontuações...</TableCell>
          </TableRow>
        ) : entries.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">Nenhuma pontuação registrada ainda</TableCell>
          </TableRow>
        ) : (
          entries.map((entry, index) => (
            <TableRow key={entry.id || index}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.grade}</TableCell>
              <TableCell>{entry.gameType}</TableCell>
              <TableCell className={entry.score > 10 ? "text-game-correct font-bold" : "text-game-wrong"}>
                {entry.score} pontos
              </TableCell>
              <TableCell>{entry.date}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable;
