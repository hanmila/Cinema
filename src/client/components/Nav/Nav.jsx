import React, { useState, useMemo, useEffect, useRef } from 'react';
import Calendar from '../Calendar/Calendar';
import './Nav.css';

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const Navigation = ({ onDayChange }) => {
  const today = useMemo(() => new Date(), []);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCalendarOpen, setIscalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

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

  const navRef = useRef(null);

  const handleSelect = (index) => {
    const newSelectedDate = weekDays[index];

    // Переключаем активную вкладку
    setSelectedIndex(index);
    // Сохраняем выбранную дату
    setSelectedDate(newSelectedDate);

    // Закрываем календарь
    setIscalendarOpen(false);

    onDayChange?.(
      weekDays[index].toISOString().slice(0, 10)
    );
  };

  // следующая неделя
  const handleNextWeek = () => {
    const newOffset = weekOffset + 6;
    setWeekOffset(newOffset);
    setSelectedIndex(0);

    const newStart = new Date(today);
    newStart.setDate(today.getDate() + newOffset);

    onDayChange?.(
      newStart.toISOString().slice(0, 10)
    );
  };

  // Для открытия и закрытия календаря
  const toggleCalendar = () => {
    setIscalendarOpen((prev) => !prev);
  };

  const closeCalendar = () => {
    setIscalendarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Если календарь открыт
      // и пользователь нажал НЕ внутри навигации
      if (
        isCalendarOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setIscalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isCalendarOpen]);

  const handleCalendarDateSelect = (calendarDate) => {
    const selected = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      calendarDate.getDate()
    );

    // Ищем выбранную дату среди текущих 6 вкладок
    const index = weekDays.findIndex((date) =>
      isSameDate(date, selected)
    );

    console.log("Выбрана:", selected);
    console.log("Текущие вкладки:", weekDays);
    console.log("Найденный index:", index);

    if (index !== -1) {
      // Дата уже отображается в навигации
      setSelectedDate(selected);
      setSelectedIndex(index);

      onDayChange?.(
        selected.toISOString().slice(0, 10)
      );

      // Закрываем календарь
      setIscalendarOpen(false);

      return;
    }

    // Дата находится за пределами текущих 6 вкладок
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffInDays = Math.round(
      (selected - todayStart) /
      (1000 * 60 * 60 * 24)
    );

    const newWeekOffset =
      Math.floor(diffInDays / 6) * 6;

    const newSelectedIndex =
      diffInDays - newWeekOffset;

    setSelectedDate(selected);
    setWeekOffset(newWeekOffset);
    setSelectedIndex(newSelectedIndex);

    onDayChange?.(
      selected.toISOString().slice(0, 10)
    );

    setIscalendarOpen(false);
  };

  return (
    <nav ref={navRef}>
      {weekDays.map((date, index) => {
        const isSelected = index === selectedIndex;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isRealToday = isSameDate(date, today);

        return (
          <div
            key={index}
            className={`link-block 
              ${isRealToday ? "today-block" : ""}
              ${isSelected
                ? `link-large ${isCalendarOpen ? "calendar_opened" : ""}`
                : ""
              }`}
            onClick={() => handleSelect(index)} // для возможности клика на всю вкладку, а не только на ссылку
          >
            <button
              type="button"
              className={`${index === 0 ? "link-first" : "link"} ${isWeekend ? "weekend" : ""}`}
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
            </button>

            {isSelected && (
              <div>
                <button
                  type="button"
                  className={`open-calendar__btn ${isCalendarOpen ? "open-calendar__btn--active" : ""
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCalendar();
                  }}
                >
                  {isCalendarOpen ? "" : ""}
                </button>

                {isSelected && isCalendarOpen && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Calendar
                      isOpen={isCalendarOpen}
                      onClose={closeCalendar}
                      onDateSelect={handleCalendarDateSelect}
                      year={selectedDate.getFullYear()}
                      month={selectedDate.getMonth() + 1}
                      day={selectedDate.getDate()}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="link-block"
        type="button"
        onClick={handleNextWeek}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleNextWeek();
          }
        }}
      >
        <span className="link next" aria-label="Следующая неделя">
          &gt;
        </span>
      </div>
    </nav>
  );
};

export default Navigation;