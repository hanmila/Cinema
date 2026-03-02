import React, { useState, useMemo } from "react";
import '../css/Nav.css';

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const Navigation = ({ onDayChange }) => {
  const today = useMemo(() => new Date(), []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isSameDate = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(today);
    start.setDate(today.getDate() + weekOffset);

    for (let i = 0; i < 6; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }

    return days;
  }, [today, weekOffset]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    onDayChange?.(
      weekDays[index].toISOString().slice(0, 10)
    );
  };

  // следующая неделя
  const handleNextWeek = () => {
    const newOffset = weekOffset + 7;
    setWeekOffset(newOffset);
    setSelectedIndex(0);

    const newStart = new Date(today);
    newStart.setDate(today.getDate() + newOffset);

    onDayChange?.(
      newStart.toISOString().slice(0, 10)
    );
  };

  return (
    <nav>
      {weekDays.map((date, index) => {
        const isSelected = index === selectedIndex;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isRealToday = isSameDate(date, today);

        return (
          <div
            key={index}
            className={`link-block ${isSelected ? "link-large" : ""}`}
          >
            <a
              href="#0"
              className={`${index === 0 ? "link-first" : "link"
                } ${isWeekend ? "weekend" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(index);
              }}
            >
              <span
                className={`page-nav__day-week ${isRealToday ? "today" : ""
                  }`}
              >
                {DAYS[date.getDay()]},{" "}
              </span>

              <span
                className={
                  isRealToday ? "link-today" : "page-nav__day-number"
                }
              >
                {date.getDate()}
              </span>
            </a>
          </div>
        );
      })}

      <div className="link-block">
        <a
          href="#0"
          className="link next"
          aria-label="Следующая неделя"
          onClick={(e) => {
            e.preventDefault();
            handleNextWeek();
          }}
        >
          &gt;
        </a>
      </div>
    </nav>
  );
};

export default Navigation;