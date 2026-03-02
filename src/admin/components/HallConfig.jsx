import React, { useState, useEffect } from "react";
import CollapsingHeader from './CollapsingHeader';
import '../css/HallConfig.css';
import API from '../../api/api';

const api = new API();

const seatTypes = ["regular", "vip", "blocked"];

// Функция для преобразования layout
const generateLayout = (rows, seats) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: seats }, () => "regular")
  );
};

function convertLayoutToConfig(layout) {
  return layout.map(row =>
    row.map(seat => {
      if (seat === "vip") return "vip";
      if (seat === "disabled") return "disabled";
      return "standart";
    })
  );
}

function HallConfig({ halls, activeHallId, setActiveHallId }) {
  const [isOpen, setIsOpen] = useState(true); // по умолчанию открыто
  const [hallConfig, sethallConfig] = useState({});

  // Создаём конфиг для всех залов при монтировании / добавлении нового зала
  useEffect(() => {
    sethallConfig((prev) => {
      const newConfigs = { ...prev };
      halls.forEach((hall) => {
        if (!newConfigs[hall.id]) {
          newConfigs[hall.id] = {
            rows: 10,
            seats: 10,
            layout: generateLayout(10, 10),
          };
        }
      });
      return newConfigs;
    });
  }, [halls]);

  if (!activeHallId || !hallConfig[activeHallId]) return null;

  const current = hallConfig[activeHallId];

  // Изменение количества рядов или мест
  const handleNumberChange = (e, type) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 2);
    const number = Number(value);
    if (!number || number < 1) return;

    sethallConfig((prev) => {
      const hall = prev[activeHallId];
      const newRows = type === "rows" ? number : hall.rows;
      const newSeats = type === "seats" ? number : hall.seats;

      return {
        ...prev,
        [activeHallId]: {
          rows: newRows,
          seats: newSeats,
          layout: generateLayout(newRows, newSeats),
        },
      };
    });
  };

  // Переключение типа кресла по клику
  const handleSeatClick = (rowIndex, seatIndex) => {
    sethallConfig((prev) => {
      const hall = prev[activeHallId];
      const newLayout = hall.layout.map((row) => [...row]);

      const currentType = newLayout[rowIndex][seatIndex];
      const nextType =
        seatTypes[(seatTypes.indexOf(currentType) + 1) % seatTypes.length];

      newLayout[rowIndex][seatIndex] = nextType;

      return {
        ...prev,
        [activeHallId]: {
          ...hall,
          layout: newLayout,
        },
      };
    });
  };

  // Сохранение данных зала

  const handleSave = async () => {
    const current = hallConfig[activeHallId];

    const payload = {
      hallId: Number(activeHallId),
      rowCount: Number(current.rows),
      placeCount: Number(current.seats),
      config: convertLayoutToConfig(current.layout),
    };
    
    try {
      const response = await api.saveHallConfig(payload);
      console.log("Ответ сервера:", response);
      alert("Сохранено");
    } catch (error) {
      console.error("Ошибка сервера:", error);
      alert("Ошибка при сохранении");
    }
  };

  // Отмена изменений
  const handleCancel = () => {
    if (window.confirm("Вы уверены, что хотите отменить?")) {
      window.location.reload();
    }
  };

  return (
    <section className="conf-step__wrapper-block hall-configuration">

      <CollapsingHeader
        title="Конфигурация залов"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="conf-step__wrapper">
          <div className="configure">
            <span className="hall-configuration__paragraph">Выберите зал для конфигурации</span>
            <ul className="halls__list-buttons">
              {halls.map(hall => (
                <li
                  key={hall.id}
                  className={`halls__list-buttons-item ${hall.id === activeHallId ? "chosen-hall" : ""
                    }`}
                  onClick={() => setActiveHallId(hall.id)}
                >
                  {hall.hall_name}
                </li>
              ))}
            </ul>
          </div>
          <div className="places">
            <span className="hall-configuration__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</span>
            <div className="hall-conf-step__legend">
              <label className="hall-conf-step-label rows-label">
                Рядов, шт
                <input
                  id="rowsInput"
                  className="conf-step-input"
                  value={current.rows}
                  onChange={(e) => handleNumberChange(e, "rows")}
                />
              </label>
              <p className="multiplication-sign">x</p>
              <label className="hall-conf-step-label chairs-label">
                Мест, шт
                <input
                  id="seatsInput"
                  className="conf-step-input"
                  value={current.seats}
                  onChange={(e) => handleNumberChange(e, "seats")}
                />
              </label>
            </div>
          </div>
          <div className="frame">
            <div className="hall-configuration__paragraph">
              <span>Теперь вы можете указать типы кресел на схеме зала:</span>
            </div>
            <div className="places-type">
              <div className="places-type__explanation">
                <div className="conf-step__chair regular-chair"></div>
                <span className="conf-step__explanation"> — обычные кресла </span>
              </div>
              <div className="places-type__explanation">
                <div className="conf-step__chair vip-chair"></div>
                <span className="conf-step__explanation"> — VIP кресла </span>
              </div>
              <div className="places-type__explanation">
                <div className="conf-step__chair blocked-chair"></div>
                <span className="conf-step__explanation"> — заблокированные (нет кресла)</span>
              </div>
            </div>
            <div className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</div>
            <div className="conf-step__hall">
              <div className="conf-step__hall-wrapper">
                {current.layout.map((row, rowIndex) => (
                  <div key={rowIndex} className="conf-step__row">
                    {row.map((seat, seatIndex) => (
                      <span
                        key={seatIndex}
                        className={`conf-step__chair ${seat}`}
                        onClick={() => handleSeatClick(rowIndex, seatIndex)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="conf-step__buttons">
            <button
              type="button"
              className="fieldset-button save__btn"
              onClick={handleSave}
            >Сохранить
            </button>
            <button
              type="button"
              className="fieldset-button cancel__btn"
              onClick={handleCancel}
            >Отмена
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default HallConfig;