// data/classSchedules.js

export const classSchedules = [];

// Helper para añadir horarios repetidos
const addSchedules = (type, days, times) => {
  days.forEach((day) => {
    times.forEach((time) => {
      classSchedules.push({ type, day, time });
    });
  });
};

// Días de la semana
const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Horarios por clase
addSchedules(
  "P. Reformer",
  ["Lunes", "Martes", "Miércoles", "Jueves"],
  ["8:30-9:30","9:30-10:30","10:30-11:30","15:30-16:30","16:30-17:30","17:30-18:30","18:30-19:30","19:30-20:30"]
);
addSchedules(
  "P. Reformer",
  ["Viernes"],
  ["8:30-9:30","9:30-10:30","10:30-11:30","13:30-14:30"]
);

addSchedules(
  "P. Reformer",
  ["Sábado"],
  ["8:00-9:00","9:00-10:00","10:00-11:00"]
);

addSchedules(
  "Funcional",
  weekdays,
  ["7:00-8:00","8:00-9:00","9:00-10:00","12:30-13:30","13:30-14:30","14:30-15:30","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00"]
);

addSchedules(
  "Funcional",
  ["Sábado"],
  ["8:00-9:00","9:00-10:00","10:00-11:00"]
);

addSchedules(
  "Barre",
  weekdays,
  ["8:00-9:00","9:00-10:00","17:00-18:00","18:00-19:00"]
);

addSchedules(
  "Barre",
  ["Sábado"],
  ["8:00-9:00","9:00-10:00","10:00-11:00"]
);

addSchedules(
  "Yoga",
  weekdays,
  ["7:00-8:00","8:00-9:00","19:00-20:00","20:00-21:00"]
);
