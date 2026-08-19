import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Calendar.css';

function Calendar({ year: initialYear, month: initialMonth, day: initialDay, onDateSelect, }) {
  const [date, setDate] = useState({
    year: initialYear,
    month: initialMonth - 1,
    day: initialDay,
  });

  const [selectedDate, setSelectedDate] = useState(
    formatDate(initialDay, initialMonth - 1, initialYear)
  );

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  function formatDate(day, month, year) {
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month + 1).padStart(2, "0");

    return `${formattedDay}.${formattedMonth}.${year}`;
  }

  const today = new Date();

  const todayWithoutTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  function resetDate() {
    setDate({
      year: initialYear,
      month: initialMonth - 1,
      day: initialDay,
    });

    setSelectedDate(
      formatDate(initialDay, initialMonth - 1, initialYear)
    );
  }

  function prevMonth() {
    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Если на текущем месяце, нельзя нажать назад
    if (
      date.year === currentYear &&
      date.month === currentMonth
    ) {
      return;
    }

    setDate((current) => {
      if (current.month === 0) {
        return {
          ...current,
          year: current.year - 1,
          month: 11,
        };
      }

      return {
        ...current,
        month: current.month - 1,
      };
    });
  }

  function nextMonth() {
    setDate((current) => {
      if (current.month === 11) {
        return {
          ...current,
          year: current.year + 1,
          month: 0,
        };
      }

      return {
        ...current,
        month: current.month + 1,
      };
    });
  }

  // Количество дней в текущем месяце
  const daysInMonth = new Date(
    date.year,
    date.month + 1,
    0
  ).getDate();

  const days = [];

  const firstDay = new Date(
    date.year,
    date.month,
    1
  );

  // Количество дней в предыдущем месяце
  const daysInPreviousMonth = new Date(
    date.year,
    date.month,
    0
  ).getDate();

  // Превращаем JS-нумерацию:
  // Вс = 0, Пн = 1 ... Сб = 6
  // в нашу:
  // Пн = 0 ... Вс = 6
  const startDay =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;

  for (let i = 0; i < 42; i++) {
    let day;
    let cellDate;
    let isOtherMonth = false;

    // Дни предыдущего месяца
    if (i < startDay) {
      day =
        daysInPreviousMonth -
        startDay +
        i +
        1;

      cellDate = new Date(
        date.year,
        date.month - 1,
        day
      );

      isOtherMonth = true;
    }

    // Дни текущего месяца
    else if (i < startDay + daysInMonth) {
      day = i - startDay + 1;

      cellDate = new Date(
        date.year,
        date.month,
        day
      );
    }

    // Дни следующего месяца
    else {
      day =
        i -
        (startDay + daysInMonth) +
        1;

      cellDate = new Date(
        date.year,
        date.month + 1,
        day
      );

      isOtherMonth = true;
    }

    const currentDate = formatDate(
      cellDate.getDate(),
      cellDate.getMonth(),
      cellDate.getFullYear()
    );

    const selected = currentDate === selectedDate;

    const isPast =
      cellDate < todayWithoutTime;

    days.push(
      <div
        key={i}
        className={`day
        ${selected ? " day-active" : ""}
        ${isPast ? " disabled-day" : ""}
        ${isOtherMonth ? " other-month" : ""}
      `}
        onClick={() => {
          if (isPast) return;

          setSelectedDate(
            formatDate(
              cellDate.getDate(),
              cellDate.getMonth(),
              cellDate.getFullYear()
            )
          );

          onDateSelect?.(cellDate);
        }}
      >
        {day}
      </div>
    );
  }

  const now = new Date();

  const isCurrentMonth =
    date.year === now.getFullYear() &&
    date.month === now.getMonth();

  return (
    <>
      <div className="calendar">
        <div className="month">
          <span className="month-active">
            <b>{monthNames[date.month]}</b>{" "}
            {date.year}
          </span>

          <span className="month-selector">
            <a
              className={`month-selector__prev ${isCurrentMonth ? "disabled-month" : ""
                }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                prevMonth();
              }}
            >
              ⟵
            </a>

            <a
              className="month-selector__reset"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                resetDate();
              }}
            >
              ○
            </a>

            <a
              className="month-selector__next"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                nextMonth();
              }}
            >
              ⟶
            </a>
          </span>
        </div>

        <div className="weekdays">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(
            (day) => (
              <div className="day" key={day}>
                {day}
              </div>
            )
          )}
        </div>

        <div className="days">
          {days}
        </div>
      </div>
    </>
  );
}

export default Calendar;