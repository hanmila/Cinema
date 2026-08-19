import { useState } from 'react';
import closeBtn from '../../../img/close.png';
import API from '../../../../api/api';
import './PopupHall.css';

const api = new API();

function PopupHall({ isOpen, onClose, halls, setHalls, normalizeHalls }) {
  const [hallName, setHallName] = useState('');

  if (!isOpen) return null;

  const handleAddHall = async () => {
    const name = hallName.trim();

    // Проверка 1 — пустое ли поле
    if (!name) {
      alert("Введите название зала!");
      return;
    }

    // Проверка 2 — зал уже существует (учитываем hall_name с сервера)
    if (halls.some(h => h.hall_name?.toLowerCase() === name.toLowerCase())) {
      alert("Зал с таким названием уже существует!");
      return;
    }

    try {
      // Создаём зал на сервере
      await api.createHall(name);

      // Обновляем список залов с сервера
      const data = await api.getAllData();

      const normalized = normalizeHalls(
        data.halls,
        data.seances
      );

      setHalls(normalized);

      // Очистка и закрытие
      setHallName("");
      onClose();

    } catch (error) {
      console.error("Ошибка добавления зала:", error);
      alert("Ошибка при добавлении зала!");
    }
  };

  return (
    <div className="popup__overlay">
      <div className="popup__content-add-hall">
        <div className="popup__header-block">
          <h2 className="popup__header">Добавление зала</h2>
          <img
            src={closeBtn}
            alt="закрыть"
            className="button_close"
            onClick={onClose} />
        </div>

        <form
          className="popup__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="popup__form-field">
            <span className="popup__form-name">Название зала</span>
            <input
              id="input_hall-name"
              className="hall-name"
              placeholder="Например, «Зал 3»"
              type="text"
              value={hallName}
              maxLength={14}
              onChange={(e) => setHallName(e.target.value)}
            />
          </label>
        </form>

        <div className="conf-step__buttons">
          <button
            type="button"
            className="add-hall-btn popup__btn"
            onClick={handleAddHall}
          >
            Добавить
          </button>

          <button
            type="button"
            className="cancel-btn popup__btn"
            onClick={onClose}
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupHall;