import React, { useState, useEffect } from 'react';
import CollapsingHeader from './CollapsingHeader';
import API from '../../api/api';
import '../css/OpenSale.css';

const OpenSale = ({ halls, hallStates, setHallStates }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHallId, setSelectedHallId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (halls.length > 0) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls]);

  const getHallSaleState = (hallId) => {
    if (!hallId || !hallStates) return false;
    return hallStates[hallId] || false;
  };

  const handleToggleSale = async () => {
    try {
      setIsLoading(true);
      const api = new API();
      const token = localStorage.getItem('token');
      if (token) api.setToken(token);

      const hall = halls.find(h => h.id === selectedHallId);
      if (!hall) throw new Error('Зал не найден');

      const currentState = getHallSaleState(selectedHallId);
      const newState = !currentState;

      await api.changeHallStatus(hall.id, newState ? 1 : 0);

      setHallStates(prev => {
        const updated = { ...prev, [selectedHallId]: newState };
        localStorage.setItem("hallStates", JSON.stringify(updated));
        return updated;
      });

      alert(newState
        ? `Зал «${hall.hall_name}» теперь ОТКРЫТ для продаж`
        : `Зал «${hall.hall_name}» теперь ЗАКРЫТ для продаж`);
    } catch (e) {
      console.error('Ошибка при изменении статуса:', e);
      alert('Не удалось изменить статус продаж: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="conf-step__wrapper-block open-sales__block">
      <CollapsingHeader
        title="ОТКРЫТЬ ПРОДАЖИ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      {isOpen && (
        <div className="conf-step__wrapper open-sales__block">
          <span className="conf-step__paragraph open-sales__paragraph">
            Выберите зал для открытия / закрытия продаж:
          </span>
          <ul className="halls__list-buttons">
            {halls.map(hall => (
              <li
                key={hall.id}
                className={`halls__list-buttons-item ${hall.id === selectedHallId ? "chosen-hall" : ""}`}
                onClick={() => setSelectedHallId(hall.id)}
              >
                {hall.hall_name}
              </li>
            ))}
          </ul>
          <div className="conf-step__paragraph open-sales__second-paragraph">
            <span>Всё готово к открытию</span>
          </div>
          <button
            type="button"
            className="fieldset-button open-sales-btn"
            onClick={handleToggleSale}
            disabled={isLoading || !selectedHallId}
          >
            {getHallSaleState(selectedHallId) ? 'Закрыть продажу билетов' : 'Открыть продажу билетов'}
          </button>
        </div>
      )}
    </section>
  );
};

export default OpenSale;