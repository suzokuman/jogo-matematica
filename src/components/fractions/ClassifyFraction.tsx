import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Kind = "Própria" | "Imprópria" | "Aparente";

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeFraction = (): { num: number; den: number; kind: Kind } => {
  const kinds: Kind[] = ["Própria", "Imprópria", "Aparente"];
  const kind = kinds[rnd(0, 2)];
  const den = rnd(2, 12);
  if (kind === "Própria") return { num: rnd(1, den - 1), den, kind };
  if (kind === "Aparente") return { num: den * rnd(1, 5), den, kind };
  let num = rnd(den + 1, den * 3);
  while (num % den === 0) num++;
  return { num, den, kind };
};

const hints: Record<Kind, string> = {
  Própria: "numerador menor que o denominador",
  Imprópria: "numerador maior que o denominador",
  Aparente: "numerador múltiplo do denominador (é um número inteiro)",
};

interface Props {
  onCorrect: () => void;
  onWrong: () => void;
}

const ClassifyFraction: React.FC<Props> = ({ onCorrect, onWrong }) => {
  const f = useMemo(makeFraction, []);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const answer = (k: Kind) => {
    if (status === "correct") return;
    if (k === f.kind) {
      setStatus("correct");
      onCorrect();
    } else {
      setStatus("wrong");
      onWrong();
    }
  };

  return (
    <div className="cosmic-card max-w-lg mx-auto text-center flex flex-col items-center gap-6 my-6">
      <p className="text-xl font-semibold">Que tipo de fração é esta?</p>
      <div className="flex flex-col items-center text-6xl font-bold neon-text leading-none">
        <span>{f.num}</span>
        <span className="w-24 border-t-4 border-current my-2" />
        <span>{f.den}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {(["Própria", "Imprópria", "Aparente"] as Kind[]).map((k) => (
          <Button key={k} className="game-button py-5 text-lg" onClick={() => answer(k)}>
            {k}
          </Button>
        ))}
      </div>
      {status === "correct" && (
        <p className="text-game-correct text-lg font-bold">Correto! É {f.kind}: {hints[f.kind]}. 🎉</p>
      )}
      {status === "wrong" && <p className="text-game-wrong text-lg font-bold">Incorreto. Tente novamente!</p>}
    </div>
  );
};

export default ClassifyFraction;
