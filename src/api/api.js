class API {
  constructor() {
    this.baseUrl = "https://shfe-diplom.neto-server.ru";
  }

  async request(url, options = {}) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Ошибка сервера");
    }

    return data.result;
  }

  // ==========================
  //  ВСЕ ДАННЫЕ
  // ==========================

  async getAllData() {
    return this.request("/alldata", {
      method: "GET",
    });
  }

  // ==========================
  //  АВТОРИЗАЦИЯ
  // ==========================

  async login(login, password) {
    const formData = new FormData();
    formData.append("login", login);  //  Логин - shfe-diplom@netology.ru
    formData.append("password", password); //  Пароль - shfe-diplom

    return this.request("/login", {
      method: "POST",
      body: formData,
    });
  }

  // ==========================
  //  ДОБАВЛЕНИЕ / УДАЛЕНИЕ ЗАЛА
  // ==========================

  // -- Добавление нового кинозала
  async createHall(name) {
    const formData = new FormData();
    formData.append("hallName", name);

    return this.request("/hall", {
      method: "POST",
      body: formData,
    });
  }

  // -- Удаление кинозала
  async deleteHall(hallId) {  // hallId - ID удаляемого кинозала (Например 34)
    return this.request(`/hall/${hallId}`, {
      method: "DELETE",
    });
  }

  // ==========================
  // КОНФИГУРАЦИЯ ЗАЛА
  // ==========================

  async saveHallConfig({ hallId, rowCount, placeCount, config }) {
    const formData = new FormData();

    formData.append("rowCount", rowCount);
    formData.append("placeCount", placeCount);

    // ВАЖНО: отправляем строку!
    formData.append("config", JSON.stringify(config));
    
    formData.append("hallOpen", 0);

    return this.request(`/hall/${hallId}`, {
      method: "POST",
      body: formData,
    });
  }

  // ==========================
  //  ЦЕНЫ
  // ==========================

  async savePrice({ hallId, priceStandart, priceVip }) {
  const formData = new FormData();
  formData.append("priceStandart", priceStandart);
  formData.append("priceVip", priceVip);

  return this.request(`/price/${hallId}`, {
    method: "POST",
    body: formData,
  });
}

  // ==========================
  //  ФИЛЬМЫ
  // ==========================

  // -- Добавление нового фильма
  async createFilm({
    filmName,
    filmDuration,
    filmDescription,
    filmOrigin,
    filePoster,
    filmColor
  }) {
    const formData = new FormData();

    formData.append("filmName", filmName);
    formData.append("filmDuration", filmDuration);
    formData.append("filmDescription", filmDescription);
    formData.append("filmOrigin", filmOrigin);
    formData.append("filePoster", filePoster); // файл из input type="file"
    formData.append("filmColor", filmColor); // сохранение цвета в бд

    return this.request("/film", {
      method: "POST",
      body: formData,
    });
  }

  // -- Удаление фильма
  async deleteFilm(filmId) {
    return this.request(`/film/${filmId}`, {
      method: "DELETE",
    });
  }

  // ==========================
  //  СЕАНСЫ
  // ==========================

  // -- Добавление нового сеанса
  async createSeance({ hallId, filmId, time }) {
    const formData = new FormData();
    formData.append("seanceHallid", hallId);
    formData.append("seanceFilmid", filmId);
    formData.append("seanceTime", time);

    return this.request("/seance", {
      method: "POST",
      body: formData,
    });
  }

  // -- Удаление сеанса
  async deleteSeance(id) {
    const formData = new FormData();
    formData.append("seanceId", id);

    return this.request("/seance", {
      method: "DELETE",
      body: formData,
    });
  }

  // ==========================
  //  ОТКРЫТЬ / ЗАКРЫТЬ ПРОДАЖИ
  // ==========================

  async changeHallStatus(hallId, hallOpen) { // hallOpen - новое значение статуса (число) - предают в теле запроса
    const formData = new FormData();
    formData.set("hallOpen", hallOpen); // 0 - зал закрыт или 1 - зал открыт

    return this.request(`/open/${hallId}`, {
      method: "POST",
      body: formData,
    });
  }

  // ===========================
  //  КЛИЕНТ
  // ===========================

  // -- Получение актуальной схемы зала на выбранный сеанс с учетом даты
  async getHallConfig(seanceId, date) {
    return this.request(
      `/hallconfig?seanceId=${seanceId}&date=${date}`,
      {
        method: "GET",
      }
    );
  }

  // -- Покупка билетов
  async buyTicket({ seanceId, ticketDate, tickets }) {
    const formData = new FormData();

    formData.append("seanceId", seanceId);
    formData.append("ticketDate", ticketDate);

    // tickets — массив объектов → нужно отправить строкой
    formData.append("tickets", JSON.stringify(tickets));

    return this.request("/ticket", {
      method: "POST",
      body: formData,
    });
  }
}

export default API;