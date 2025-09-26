"use client";

import { dateToInputValue } from "../../lib/dates";
import { useMemo } from "react";

export default function DateSelect({ value, onChange }) {
  // Calcular fecha mínima (hoy) y máxima (hoy + 7 días)
  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const max = new Date(today);
    max.setDate(today.getDate() + 7);
    return max;
  }, [today]);

  const minDateString = useMemo(() => dateToInputValue(today), [today]);
  const maxDateString = useMemo(() => dateToInputValue(maxDate), [maxDate]);

  // Validar que la fecha actual esté dentro del rango permitido
  const isCurrentDateValid = useMemo(() => {
    return value >= minDateString && value <= maxDateString;
  }, [value, minDateString, maxDateString]);

  // Si la fecha actual está fuera del rango, usar hoy como valor por defecto
  const validValue = useMemo(() => {
    return isCurrentDateValid ? value : minDateString;
  }, [isCurrentDateValid, value, minDateString]);

  const prev = useMemo(() => {
    const [y, m, d] = validValue.split("-").map(Number);
    const prevDate = new Date(y, m - 1, d - 1);
    return dateToInputValue(prevDate);
  }, [validValue]);

  const next = useMemo(() => {
    const [y, m, d] = validValue.split("-").map(Number);
    const nextDate = new Date(y, m - 1, d + 1);
    return dateToInputValue(nextDate);
  }, [validValue]);

  // Verificar si los botones de navegación deben estar habilitados
  const canGoPrev = prev >= minDateString;
  const canGoNext = next <= maxDateString;

  const handleChange = (newValue) => {
    // Solo permitir cambios dentro del rango válido
    if (newValue >= minDateString && newValue <= maxDateString) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto justify-center flex items-center gap-3 mb-6">
      <button
        type="button"
        className="rounded-md px-3 py-2 transition"
        style={{ 
          backgroundColor: canGoPrev ? "#cbc8bf" : "#e5e5e5", 
          color: canGoPrev ? "#fff" : "#999",
          cursor: canGoPrev ? "pointer" : "not-allowed"
        }}
        onClick={() => canGoPrev && handleChange(prev)}
        disabled={!canGoPrev}
      >
        ←
      </button>

      <input
        type="date"
        className="flex-1 max-w-[150px] rounded-md p-3 text-center"
        style={{ color: "rgb(173, 173, 174)", borderWidth: "0.5px" }}
        value={validValue}
        min={minDateString}
        max={maxDateString}
        onChange={(e) => handleChange(e.target.value)}
      />

      <button
        type="button"
        className="rounded-md px-3 py-2 transition"
        style={{ 
          backgroundColor: canGoNext ? "#cbc8bf" : "#e5e5e5", 
          color: canGoNext ? "#fff" : "#999",
          cursor: canGoNext ? "pointer" : "not-allowed"
        }}
        onClick={() => canGoNext && handleChange(next)}
        disabled={!canGoNext}
      >
        →
      </button>
    </div>
  );
}