import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function EarningsCalculator() {
  const [pricePerMinute, setPricePerMinute] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(4);

  const minutesPerDay = hoursPerDay * 60;
  const daysPerMonth = 22; // dias úteis
  const grossMonthly = pricePerMinute * minutesPerDay * daysPerMonth;
  const streamerSplit = 0.70;
  const netMonthly = grossMonthly * streamerSplit;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-pink-900">
          💰 Calcule seus Ganhos
        </CardTitle>
        <CardDescription className="text-center text-pink-700">
          Veja quanto você pode faturar com chamadas de vídeo privadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-pink-900 font-semibold">
              Preço por minuto: R$ {pricePerMinute.toFixed(2)}
            </Label>
            <Slider
              id="price"
              min={2}
              max={100}
              step={1}
              value={[pricePerMinute]}
              onValueChange={(value) => setPricePerMinute(value[0])}
              className="w-full"
            />
            <p className="text-sm text-pink-600">
              Mínimo: R$ 1,99 • Máximo: R$ 100,00
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="text-pink-900 font-semibold">
              Horas online por dia: {hoursPerDay}h
            </Label>
            <Slider
              id="hours"
              min={1}
              max={12}
              step={1}
              value={[hoursPerDay]}
              onValueChange={(value) => setHoursPerDay(value[0])}
              className="w-full"
            />
            <p className="text-sm text-pink-600">
              1 a 12 horas por dia
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border-2 border-pink-300 shadow-lg">
          <div className="text-center space-y-2">
            <p className="text-pink-700 font-medium">
              Você pode faturar até
            </p>
            <p className="text-5xl font-bold text-pink-600">
              R$ {netMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-pink-700 font-medium">
              por mês*
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-pink-200 text-xs text-pink-600 space-y-1">
            <p>* Cálculo baseado em:</p>
            <p>• {minutesPerDay} minutos/dia × {daysPerMonth} dias úteis</p>
            <p>• Você recebe 70% do valor (R$ {grossMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} bruto)</p>
            <p>• Valores podem variar conforme demanda e disponibilidade</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
