import React, { useState, useEffect } from 'react';
import CollapsingHeader from '../CollapsingHeader/CollapsingHeader';
import API from '../../../api/api';
import './OpenSale.css';

const OpenSale = ({
  halls,
  hallStates,
  setHallStates,
  activeHallId,
  setActiveHallId
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (halls.length > 0 && !activeHallId) {
      setActiveHallId(halls[0].id);
    }
  }, [halls, activeHallId, setActiveHallId]);

  const getHallSaleState = (hallId) => {
    if (!hallId || !hallStates) return false;

    // сначала проверяем локальное состояние
    if (hallStates[hallId] !== undefined) {
      return hallStates[hallId];
    }

    // если нет в state — берем из hall_open
    const hall = halls.find(h => h.id === hallId);

    return hall?.hall_open === 1;
  };

  const handleToggleSale = async () => {
    try {
      setIsLoading(true);

      const api = new API();

      const token = localStorage.getItem('token');

      if (token) {
        api.setToken(token);
      }

      const hall = halls.find(h => h.id === activeHallId);

      if (!hall) {
        throw new Error('Зал не найден');
      }

      const currentState = getHallSaleState(activeHallId);

      const newState = !currentState;

      await api.changeHallStatus(hall.id, newState ? 1 : 0);

      setHallStates(prev => {
        const updated = {
          ...prev,
          [activeHallId]: newState
        };

        localStorage.setItem(
          'hallStates',
          JSON.stringify(updated)
        );

        return updated;
      });

      alert(
        newState
          ? `Зал «${hall.hall_name}» теперь ОТКРЫТ для продаж`
          : `Зал «${hall.hall_name}» теперь ЗАКРЫТ для продаж`
      );

    } catch (e) {
      console.error('Ошибка при изменении статуса:', e);

      alert(
        'Не удалось изменить статус продаж: ' + e.message
      );

    } finally {
      setIsLoading(false);
    }
  };

  const isSaleOpen = getHallSaleState(activeHallId);

  return (
    <section className="conf-step__wrapper-block open-sales__block">

      <div className="section-header__end">
        <CollapsingHeader
          title="ОТКРЫТЬ ПРОДАЖИ"
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="conf-step__wrapper open-sales__content">

          <span className="conf-step__paragraph open-sales__paragraph">
            Выберите зал для открытия / закрытия продаж:
          </span>

          <ul className="halls__list-buttons">
            {halls.map(hall => (
              <li
                key={hall.id}
                className={`halls__list-buttons-item ${hall.id === activeHallId
                    ? 'chosen-hall'
                    : ''
                  }`}
                onClick={() => setActiveHallId(hall.id)}
              >
                {hall.hall_name}
              </li>
            ))}
          </ul>

          {!isSaleOpen && (
            <div className="conf-step__paragraph open-sales__second-paragraph">
              <span>Всё готово к открытию</span>
            </div>
          )}

          <button
            type="button"
            className="fieldset-button open-sales-btn"
            onClick={handleToggleSale}
            disabled={isLoading || !activeHallId}
          >
            {isSaleOpen
              ? 'Закрыть продажу билетов'
              : 'Открыть продажу билетов'}
          </button>

        </div>
      )}
    </section>
  );
};

export default OpenSale;