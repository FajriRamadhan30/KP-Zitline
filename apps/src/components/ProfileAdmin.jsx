import { useState } from "react";
import "../components/CSS/ProfileAdmin.css"; // Kalau mau style khusus

function ProfileAdmin() {
  const [adminInfo, setAdminInfo] = useState({
    name: "Admin Zitline",
    email: "admin@zitline.com",
  });

  const handleEditProfile = () => {
    alert("Fitur edit profile coming soon!");
  };

  return (
    <div className="profile-admin-container">
      <h2>👤 Admin Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {adminInfo.name}</p>
        <p><strong>Email:</strong> {adminInfo.email}</p>
      </div>
      <button className="edit-profile-btn" onClick={handleEditProfile}>
        ✏️ Edit Profile
      </button>
    </div>
  );
}

export default ProfileAdmin;
