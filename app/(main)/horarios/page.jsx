"use client";

import { useState } from "react";
import { classSchedules } from "../../../data/classSchedules";

const hours = [
  "7:00-8:00","8:00-9:00","8:30-9:30","9:00-10:00","9:30-10:30",
  "10:30-11:30","12:30-13:30","13:30-14:30","14:30-15:30","15:30-16:30",
  "16:30-17:30","17:00-18:00","17:30-18:30","18:00-19:00","18:30-19:30",
  "19:00-20:00","19:30-20:30","20:00-21:00"
];

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const typeColors = {
  Yoga: "rgb(182, 179, 170)",
  "P. Reformer": "rgb(204, 201, 191)",
  Funcional: "rgb(229, 226, 219)",
  Barre: "rgb(200, 197, 187)",
};

export default function ScheduleGrid() {
  const [filter, setFilter] = useState("P. Reformer");
  const classTypes = ["Todas", "Yoga", "P. Reformer", "Funcional", "Barre"];

  const filteredData =
    filter === "Todas"
      ? classSchedules
      : classSchedules.filter((c) => c.type === filter);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 md:px-0">
      <h1 className="text-3xl text-center mb-8" style={{ color: 'rgb(173, 173, 174)' }}>
        Horarios
      </h1>

      {/* Botones de filtro */}
      {/* Contenedor con scroll horizontal */}
      <div className="overflow-x-auto hide-scrollbar mb-6">
        <div className="flex flex-nowrap gap-4 justify-start md:justify-center">
          {["Yoga", "P. Reformer", "Funcional", "Barre"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 font-medium rounded-full transition-colors flex-shrink-0"
              style={{
                backgroundColor: filter === type ? 'rgb(173,173,174)' : 'transparent',
                color: filter === type ? 'white' : 'rgb(173,173,174)',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>



      {/* Grid con scroll horizontal */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-6 gap-2">
          {/* Header días */}
          <div className="text-center py-2"></div>
          {days.map((day) => (
            <div key={day} className="text-center py-2" style={{ color: 'rgb(173, 173, 174)' }}>
              {day}
            </div>
          ))}

          {/* Filas de horas */}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div
                className="px-2 py-1 text-center"
                style={{
                  color: 'rgb(173, 173, 174)',
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  backgroundColor: '#ffffffff'
                }}
              >
                {hour}
              </div>

              {days.map((day) => {
                const cells = filteredData.filter(
                  (c) => c.day === day && c.time === hour
                );

                return (
                  <div
                    key={day + hour}
                    className={`h-10 relative flex flex-col justify-center gap-1`}
                    style={{
                      minHeight: "3rem",
                      height: cells.length > 1 ? `${cells.length * 3}rem` : "3rem",
                    }}
                  >
                    {cells.map((cell, index) => (
                      <div
                        key={index}
                        className="w-full flex-1 flex items-center justify-center rounded-md text-center text-white transition-opacity duration-500 opacity-0 animate-fadeIn"
                        style={{ backgroundColor: typeColors[cell.type], padding: "0.25rem" }}
                      >
                        {cell.type}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
