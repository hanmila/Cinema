import React from 'react';
import '../css/AdminHeader.css';


const AdminHeader = () => {
  return (
    // чтобы задать css стили //
    <header className="admin-header">
      <div className="admin-header_container">
        <h1 className="admin-header_title">
          Идём<span className="preposition">в</span>кино
        </h1>
        <div className="admin-header_subheading">Администраторррская</div>
      </div>
    </header>
  );
};

export default AdminHeader;