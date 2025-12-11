// data/classSchedules.js

export let classSchedules = [];

// Helper para añadir horarios repetidos
const addSchedules = (type, days, times) => {
  days.forEach((day) => {
    times.forEach((time) => {
      classSchedules.push({ type, day, time });
    });
  });
};

// Días de la semana
const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Horarios por clase
addSchedules(
  "P. Reformer",
  ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
  ["8:30-9:30","9:30-10:30","10:30-11:30","15:00-16:00", "16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00"]
);

addSchedules(
  "P. Reformer",
  ["Martes", "Jueves"],
  ["7:30-8:30"]
);

addSchedules(
  "P. Reformer",
  ["Sábado"],
  ["9:00-10:00","10:00-11:00"]
);

addSchedules(
  "Funcional",
  ["Lunes", "Martes", "Miércoles", "Jueves"],
  ["7:00-8:00","8:00-9:00","9:30-10:30","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00"]
);

addSchedules(
  "Funcional",
  ["Viernes"],
  ["7:00-8:00","8:00-9:00","9:30-10:30","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00"]
);

addSchedules(
  "Funcional",
  ["Sábado"],
  ["9:00-10:00","10:00-11:00"]
);


addSchedules(
  "Barre",
  ["Lunes","Martes","Miércoles","Jueves"],
  ["8:30-9:30","9:30-10:30","10:30-11:30","17:00-18:00","18:00-19:00"]
);

addSchedules(
  "Barre",
  ["Viernes"],
  ["8:30-9:30","9:30-10:30","10:30-11:30"]
);

addSchedules(
  "Barre",
  ["Lunes","Miércoles"],
  ["19:00-20:00"]
);

addSchedules(
  "Barre",
  ["Sábado"],
  ["11:00-12:00"]
);

addSchedules(
  "Yoga",
  ["Martes", "Jueves"],
  ["20:00-21:00"]
);

addSchedules(
  "Yoga",
  ["Miércoles"],
  ["11:30-12:30"]
);

classSchedules = classSchedules.filter(
  (c) =>
    !(
      c.type === "P. Reformer" &&
      c.time === "15:00-16:00" &&
      (c.day === "Miércoles" || c.day === "Viernes")
    )
);