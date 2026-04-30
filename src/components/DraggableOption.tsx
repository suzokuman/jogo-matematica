import { useState } from "react";

interface DraggableOptionProps {
  value: number;
  onDragStart: (value: number) => void;
}

const DraggableOption: React.FC<DraggableOptionProps> = ({ value, onDragStart }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", value.toString());
    onDragStart(value);
    setIsDragging(true);
  };

  const display = Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(/\.?0+$/, '');

  return (
    <div
      className={`game-option text-2xl md:text-3xl ${isDragging ? "opacity-50" : "opacity-100"} animate-fade-in`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
    >
      {display}
    </div>
  );
};

export default DraggableOption;
