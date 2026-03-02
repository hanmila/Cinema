import { useState } from 'react';
import closeBtn from '../img/close.png'
import API from "../../api/api";
import '../css/PopupFilm.css';

const api = new API();

function PopupFilm({ isOpen, onClose, films, setFilms }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");

  if (!isOpen) return null;

  // -------------------
  // Загрузка постера
  // -------------------
  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка типа
    if (file.type !== "image/png") {
      alert("Разрешены только PNG файлы");
      return;
    }

    // Проверка размера (3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert("Файл не должен превышать 3MB");
      return;
    }

    setPosterFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // -------------------
  // Добавление фильма
  // -------------------

  const normalizeFilms = (filmsFromServer) => {
    return filmsFromServer.map(film => ({
      id: film.id,
      title: film.film_name,
      duration: film.film_duration,
      description: film.film_description,
      country: film.film_origin,
      poster: film.film_poster,
      bgColor: film.film_color,
    }));
  };
  

  const handleSubmit = async () => {
    if (!title || !duration || !description || !country || !posterFile) {
      alert("Заполните все поля");
      return;
    }

    if (duration.length < 2) {
      alert("Продолжительность фильма должна быть не меньше двух знаков");
      return;
    }

    try {
      const response = await api.createFilm({
        filmName: title,
        filmDuration: Number(duration),
        filmDescription: description,
        filmOrigin: country,
        filePoster: posterFile,
        filmColor: bgColor,
      });
      console.log(response.films);

      const formatted = normalizeFilms(response.films);
      setFilms(formatted);

      // сервер возвращает обновлённый список фильмов

      resetForm();
      onClose();

    } catch (err) {
      if (err.message.includes("Duplicate entry")) {
        alert("Фильм с таким названием уже существует");
      } else {
        alert("Ошибка при добавлении фильма");
      }
    }
  };

  // -------------------
  // Очистка формы
  // -------------------
  const resetForm = () => {
    setTitle("");
    setDuration("");
    setDescription("");
    setCountry("");
    setPosterFile(null);
    setPreview(null);
  };

  return (
    <div className="popup__overlay">
      <div className="popup__content-add-film">
        <div className="popup__header-block">
          <h2 className="popup__header">Добавление фильма</h2>
          <img
            src={closeBtn}
            alt="закрыть"
            className="button_close"
            onClick={() => {
              resetForm();
              onClose();
            }} />
        </div>

        <form className="popup__form" onSubmit={e => e.preventDefault()}>
          <label className="popup__form-field">
            <span className="form__label">Название фильма</span>
            <input
              className="form__input"
              placeholder="Например, «Гражданин Кейн»"
              type="text"
              name="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="popup__form-field">
            <span className="form__label">Продолжительность фильма (мин.)</span>
            <input
              className="form__input"
              type="text"
              value={duration}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setDuration(onlyNumbers);
              }}
            />
          </label>
          <label className="popup__form-field big-field">
            <span className="form__label">Описание фильма</span>
            <input
              className="form__input big-field__input"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="popup__form-field">
            <span className="form__label">Страна</span>
            <input
              className="form__input"
              type="text"
              name="country"
              value={country}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "") // не допускать цифры и знаки препинания
                  .toUpperCase(); // чтобы все буквы стали большими

                setCountry(value);
              }}
            />
          </label>
          <label className="popup__form-field">
            <span className="form__label">Цвет карточки</span>
            <input
              type="color"
              className='popup__film-color'
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </label>
          <label className="popup__form-field">
            <input type="file" accept="image/png" onChange={handlePosterUpload} />
            {preview && <img src={preview} alt="Предпросмотр" style={{ maxWidth: 100, display: 'block' }} />}
          </label>
        </form>

        <div className="conf-step__buttons">
          <button type="button" className="add-film-btn popup-film__btn" onClick={handleSubmit}>
            Добавить фильм
          </button>
          <button type="button" className="cancel-btn popup-film__btn" onClick={() => {
            resetForm();
            onClose();
          }}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupFilm;