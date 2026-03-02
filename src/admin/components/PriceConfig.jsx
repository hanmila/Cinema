import React, { useState, useEffect } from "react";
import CollapsingHeader from "./CollapsingHeader";
import "../css/PriceConfig.css";
import API from "../../api/api";

const api = new API();

function PriceConfig({ halls, activeHallId, setActiveHallId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [priceConfig, setpriceConfig] = useState({});

  // Загружаем конфиг цен при монтировании и при добавлении новых залов
  useEffect(() => {
    setpriceConfig((prev) => {
      const newConfigs = { ...prev };
      halls.forEach((hall) => {
        if (!newConfigs[hall.id]) {
          newConfigs[hall.id] = {
            priceStandart: hall.hall_price_standart || 0,
            priceVip: hall.hall_price_vip || 0,
          };
        }
      });
      return newConfigs;
    });
  }, [halls]);

  if (!activeHallId || !priceConfig[activeHallId]) return null;

  const current = priceConfig[activeHallId];

  // Изменение цены
  const handlePriceChange = (e, type) => {
    const value = e.target.value.replace(/\D/g, ""); // только цифры
    setpriceConfig((prev) => ({
      ...prev,
      [activeHallId]: {
        ...prev[activeHallId],
        [type]: Number(value),
      },
    }));
  };

  // Сохранение цен
  const handleSave = async () => {
    try {
      const response = await api.savePrice({
        hallId: Number(activeHallId),
        priceStandart: Number(current.priceStandart),
        priceVip: Number(current.priceVip),
      });

      console.log("Ответ сервера:", response);
      alert("Цены сохранены");
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
    <section className="conf-step__wrapper-block price-configuration">
      <CollapsingHeader
        title="Конфигурация цен"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="conf-step__wrapper">
          {/* Выбор зала */}
          <div className="configure">
            <span className="price-configuration__paragraph">
              Выберите зал для конфигурации
            </span>
            <ul className="halls__list-buttons">
              {halls.map((hall) => (
                <li
                  key={hall.id}
                  className={`halls__list-buttons-item ${
                    hall.id === activeHallId ? "chosen-hall" : ""
                  }`}
                  onClick={() => setActiveHallId(hall.id)}
                >
                  {hall.hall_name}
                </li>
              ))}
            </ul>
          </div>

          {/* Настройка цен */}
          <div className="places">
            <span className="price-configuration__paragraph">
              Установите цены для типов кресел:
            </span>

            <div className="price-conf-step__legend">
              <label className="price-conf-step-label price-label">
                Цена, рублей
                <input
                  className="price-conf-step-input"
                  value={current.priceStandart}
                  onChange={(e) => handlePriceChange(e, "priceStandart")}
                />
              </label>
              <p className="conf-step__text per">за</p>
              <span className="conf-step__chair regular-chair chair-position"></span>
              <p className="conf-step__text chair__explanation">
                обычные кресла
              </p>
            </div>

            <div className="price-conf-step__legend">
              <label className="price-conf-step-label price-label">
                Цена, рублей
                <input
                  className="price-conf-step-input"
                  value={current.priceVip}
                  onChange={(e) => handlePriceChange(e, "priceVip")}
                />
              </label>
              <p className="conf-step__text per">за</p>
              <span className="conf-step__chair vip chair-position"></span>
              <p className="conf-step__text chair__explanation">
                VIP кресла
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="conf-step__buttons">
            <button
              type="button"
              className="fieldset-button save__btn"
              onClick={handleSave}
            >
              Сохранить
            </button>
            <button
              type="button"
              className="fieldset-button cancel__btn"
              onClick={handleCancel}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default PriceConfig;