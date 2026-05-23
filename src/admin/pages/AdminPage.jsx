import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminHeader from "../components/AdminHeader";
import HallManager from "../components/HallManager";
import HallConfig from "../components/HallConfig";
import PriceConfig from "../components/PriceConfig";
import SessionsGrid from "../components/SessionsGrid";
import OpenSale from "../components/OpenSale";
import API from "../../api/api";
import "../css/AdminPage.css";

const api = new API();

const normalizeHalls = (halls, seances) => {
  return (halls || []).map((hall) => ({
    ...hall,

    sessions: (seances || [])
      .filter((s) => s.seance_hallid === hall.id)
      .map((s) => ({
        id: s.id,
        filmId: s.seance_filmid,
        start: s.seance_time,
      })),
  }));
};

const AdminPage = () => {
  const [halls, setHalls] = useState([]);
  const [activeHallId, setActiveHallId] = useState(null);
  const [films, setFilms] = useState([]);
  const [hallStates, setHallStates] = useState(() => {
    return JSON.parse(localStorage.getItem('hallStates')) || {};
  });

  // =========================
  // Загрузка данных при монтировании
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAllData();

        const normalizedHalls = normalizeHalls(
          data.halls,
          data.seances
        );
        {/* Упрощение (data.halls || []).map((hall) => ({
          ...hall,

          sessions: (data.seances || [])
            .filter((s) => s.seance_hallid === hall.id)
            .map((s) => ({
              id: s.id,
              filmId: s.seance_filmid,
              start: s.seance_time,
            })),
        }));*/}

        console.log(normalizedHalls);

        setHalls(normalizedHalls);
        setFilms(data.films || []);

        if (normalizedHalls.length > 0) {
          setActiveHallId(normalizedHalls[0].id);
        }
      } catch (err) {
        console.error("Ошибка загрузки данных администратора:", err);
      }
    };

    fetchData();
  }, []);

  // =========================
  // Если данные ещё не загрузились
  // =========================
  if (!halls.length) {
    return (
      <AdminLayout>
        <AdminHeader />
        <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          Загрузка данных администратора...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader />

      <HallManager
        halls={halls}
        setHalls={setHalls}
        normalizeHalls={normalizeHalls}
        activeHallId={activeHallId}
        setActiveHallId={setActiveHallId}
      />

      <HallConfig
        halls={halls}
        setHalls={setHalls}
        activeHallId={activeHallId}
        setActiveHallId={setActiveHallId}
      />

      <PriceConfig
        halls={halls}
        activeHallId={activeHallId}
        setActiveHallId={setActiveHallId}
      />

      <SessionsGrid
        films={films}
        setHalls={setHalls}
        halls={halls}
        setFilms={setFilms}
      />

      <OpenSale
        halls={halls}
        hallStates={hallStates}
        setHallStates={setHallStates}
        activeHallId={activeHallId}
        setActiveHallId={setActiveHallId}
      />
    </AdminLayout>
  );
};

export default AdminPage;