import { useState } from "react";

interface DraggableOptionProps {
  value: number;
  onDragStart: (value: number) => void;
  onSelect: (value: number) => void;
}

const DraggableOption: React.FC<DraggableOptionProps> = ({ value, onDragStart, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", value.toString());
    onDragStart(value);
    setIsDragging(true);
  };

  const display = Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(/\.?0+$/, '');

  return (
    <button
      type="button"
      className={`game-option text-2xl md:text-3xl ${isDragging ? "opacity-60 scale-95" : "opacity-100"} animate-fade-in`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onSelect(value)}
      aria-label={`Resposta ${display}`}
    >
      {display}
    </button>
  );
};

export default DraggableOption;
