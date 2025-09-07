"use client";

import { dateToInputValue } from "../../lib/dates";
import { useMemo } from "react";

export default function DateSelect({ value, onChange }) {
  // value es "YYYY-MM-DD"
  const prev = useMemo(() => {
    const [y, m, d] = value.split("-").map(Number);
    return dateToInputValue(new Date(y, m - 1, d - 1));
  }, [value]);

  const next = useMemo(() => {
    const [y, m, d] = value.split("-").map(Number);
    return dateToInputValue(new Date(y, m - 1, d + 1));
  }, [value]);

  return (
    <div className="w-full max-w-md mx-auto justify-center flex items-center gap-3 mb-6">
      <button
        type="button"
        className="rounded-md px-3 py-2 transition"
        style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        onClick={() => onChange(prev)}
      >
        ←
      </button>

      <input
        type="date"
        className="flex-1 max-w-[150px] rounded-md p-3 text-center"
        style={{ color: "rgb(173, 173, 174)", borderWidth: "0.5px" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        type="button"
        className="rounded-md px-3 py-2 transition"
        style={{ backgroundColor: "#cbc8bf", color: "#fff" }}
        onClick={() => onChange(next)}
      >
        →
      </button>
    </div>
  );
}
