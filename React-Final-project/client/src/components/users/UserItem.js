import React from "react";
import "./UserItem.scss";

//View user card in main page
const UserItem = ({ user, onShowInfo }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onShowInfo(user);
  };

  return (
    <div onClick={handleClick} className="user">
      <span>
        {" "}
        {user.firstName} {user.lastName}{" "}
      </span>
    </div>
  );
};

export default UserItem;
