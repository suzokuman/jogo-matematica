
import { useState } from "react";
import { PlayerFormValues } from "@/components/PlayerForm";

export const usePlayerInfo = () => {
  const [playerInfo, setPlayerInfo] = useState<{ name: string; grade: string } | null>(null);

  const savePlayerInfo = (data: PlayerFormValues) => {
    const newPlayerInfo = {
      name: data.name,
      grade: data.grade,
    };
    
    setPlayerInfo(newPlayerInfo);
    localStorage.setItem("playerInfo", JSON.stringify(newPlayerInfo));
  };

  const clearPlayerInfo = () => {
    setPlayerInfo(null);
    localStorage.removeItem("playerInfo");
  };

  return {
    playerInfo,
    savePlayerInfo,
    clearPlayerInfo
  };
};
