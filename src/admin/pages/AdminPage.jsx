import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminHeader from "../components/AdminHeader";
import HallManager from "../components/HallManager";
import HallConfig from "../components/HallConfig";
import PriceConfig from "../components/PriceConfig";
import SeancesGrid from "../components/SeancesGrid";
import OpenSale from "../components/OpenSale";
import API from "../../api/api";
import "../css/AdminPage.css";

const api = new API();

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
        setHalls(data.halls || []);
        setFilms(data.films || []);

        if (data.halls && data.halls.length > 0) {
          setActiveHallId(data.halls[0].id);
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

      <HallManager halls={halls} setHalls={setHalls} />

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

      <SeancesGrid
        films={films}
        setHalls={setHalls}
        halls={halls}
        setFilms={setFilms}
      />

      <OpenSale
        halls={halls}
        hallStates={hallStates}
        setHallStates={setHallStates}
      />
    </AdminLayout>
  );
};

export default AdminPage;