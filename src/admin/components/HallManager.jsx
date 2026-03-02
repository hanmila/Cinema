import React, { useState } from 'react';
import CollapsingHeader from './CollapsingHeader';
import PopupHall from './PopupHall';
import API from '../../api/api';
import '../css/HallManager.css';

const api = new API();

function HallManager({ halls, setHalls }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  {/* Для открытия и закрытия попапа */ }
  const openPopupHall = () => setIsPopupOpen(true);
  const closePopupHall = () => setIsPopupOpen(false);

  {/* Функция удаления */ }
  const handleDeleteHall = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить зал?")) return;

    try {
      const response = await api.deleteHall(id);
      // response.halls — обновлённый список залов с сервера
      setHalls(response.halls);
      alert("Зал успешно удалён");
    } catch (error) {
      console.error("Ошибка при удалении зала:", error);
      alert("Не удалось удалить зал");
    }
  };

  return (
    <section className="conf-step__wrapper-block hall-management">

      <CollapsingHeader
        title="Управление залами"
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="conf-step__wrapper hall-management">
          <span className="hall-management-label">Доступные залы:</span>

          <ul className="halls__list">
            {halls.map(hall => (
              <li key={hall.id} className="halls__list-item">
                {hall.hall_name}
                <button
                  type="button"
                  className="delete__btn"
                  onClick={() => handleDeleteHall(hall.id)}>

                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="fieldset-button create-hall__btn"
            onClick={openPopupHall}
          >
            Создать зал
          </button>
        </div>
      )}

      <PopupHall
        isOpen={isPopupOpen}
        onClose={closePopupHall}
        halls={halls}
        setHalls={setHalls}
      />
    </section>
  );
}

export default HallManager;