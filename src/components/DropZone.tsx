
import { useState } from "react";

interface DropZoneProps {
  onDrop: (value: number) => void;
  message: string;
  status: "idle" | "correct" | "wrong";
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, message, status }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const value = parseFloat(e.dataTransfer.getData("text/plain"));
    onDrop(value);
  };

  let statusClasses = "";
  if (status === "correct") statusClasses = "correct";
  else if (status === "wrong") statusClasses = "wrong";

  return (
    <div
      className={`drop-zone ${statusClasses} ${isOver ? "bg-game-light" : ""} 
        transform transition-all duration-300 animate-fade-in`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p>{message}</p>
    </div>
  );
};

export default DropZone;
