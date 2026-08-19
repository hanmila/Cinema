import React from 'react';
import './AdminHeader.css';


const AdminHeader = () => {
  return (
    // чтобы задать css стили //

      <div className="admin-header_container">
        <h1 className="admin-header_title">
          Идём<span className="preposition">в</span>кино
        </h1>
        <div className="admin-header_subheading">Администраторррская</div>
      </div>

  );
};

export default AdminHeader;