
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const playerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  grade: z.string().min(1, "Nível é obrigatório"),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  onSubmitPlayerInfo: (data: PlayerFormValues) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmitPlayerInfo }) => {
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      grade: "",
    },
  });

  const gradeOptions = [
    { value: "1", label: "Nível 1" },
    { value: "2", label: "Nível 2" },
    { value: "3", label: "Nível 3" },
    { value: "4", label: "Nível 4" },
    { value: "5", label: "Nível 5" },
    { value: "6", label: "Nível 6" },
    { value: "7", label: "Nível 7" },
    { value: "8", label: "Nível 8" },
    { value: "9", label: "Nível 9" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitPlayerInfo)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Nível" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="game-button w-full md:w-auto">
          Continuar
        </Button>
      </form>
    </Form>
  );
};

export default PlayerForm;
