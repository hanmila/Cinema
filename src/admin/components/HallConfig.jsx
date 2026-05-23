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
      if (seat === "blocked") return "disabled";
      return "standart";
    })
  );
}

function convertConfigToLayout(config) {
  if (!config || !config.length) {
    return generateLayout(10, 10);
  }

  return config.map(row =>
    row.map(seat => {
      if (seat === "vip") return "vip";
      if (seat === "disabled") return "blocked";
      return "regular";
    })
  );
}

function HallConfig({ halls, setHalls, activeHallId, setActiveHallId }) {
  const [isOpen, setIsOpen] = useState(true); // по умолчанию открыто
  const [hallConfig, setHallConfig] = useState({});

  // Создаём конфиг для всех залов при монтировании / добавлении нового зала
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const configs = {};

    halls.forEach((hall) => {
      configs[hall.id] = {
        rows: hall.hall_rows || 10,
        seats: hall.hall_places || 10,
        layout: convertConfigToLayout(hall.hall_config),
      };
    });

    setHallConfig(configs);
  }, [halls]);

  if (!activeHallId || !hallConfig[activeHallId]) return null;

  const current = hallConfig[activeHallId];

  // Изменение количества рядов или мест
  const handleNumberChange = (e, type) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 2);

    const number = Number(value);

    if (!number || number < 1) return;

    setHallConfig((prev) => {
      const hall = prev[activeHallId];

      const newRows = type === "rows" ? number : hall.rows;
      const newSeats = type === "seats" ? number : hall.seats;

      const newLayout = Array.from({ length: newRows }, (_, rowIndex) =>
        Array.from({ length: newSeats }, (_, seatIndex) => {
          return hall.layout[rowIndex]?.[seatIndex] || "regular";
        })
      );

      return {
        ...prev,
        [activeHallId]: {
          rows: newRows,
          seats: newSeats,
          layout: newLayout,
        },
      };
    });
  };

  // Переключение типа кресла по клику
  const handleSeatClick = (rowIndex, seatIndex) => {
    setHallConfig((prev) => {
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

      // обновляем halls
      setHalls((prev) =>
        prev.map((hall) =>
          hall.id === activeHallId
            ? {
              ...hall,
              hall_rows: response.hall_rows,
              hall_places: response.hall_places,
              hall_config: response.hall_config,
            }
            : hall
        )
      );

      alert("Сохранено");
    } catch (error) {
      console.error("Ошибка сервера:", error);
      alert("Ошибка при сохранении");
    }
  };

  // Отмена изменений
  const handleCancel = () => {
    if (window.confirm("Вы уверены, что хотите отменить?")) {
      const hall = halls.find(h => h.id === activeHallId);

      if (!hall) return;

      setHallConfig((prev) => ({
        ...prev,
        [activeHallId]: {
          rows: hall.hall_rows || 10,
          seats: hall.hall_places || 10,
          layout: convertConfigToLayout(hall.hall_config),
        },
      }));
    }
  };

  return (
    <section className="conf-step__wrapper-block hall-configuration">

      <div className="section-header__middle">
        <CollapsingHeader
          title="Конфигурация залов"
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="conf-step__wrapper section-style__middle">
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