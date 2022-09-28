import React, { useState, useEffect } from "react";
import "./App.scss";
import UserItem from "./components/users/UserItem";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import Avatar from "./image/avatar.svg";
import Search from "./components/filters/Search";
import UserInfo from "./components/users/UserInfo";
import AddUser from "./components/users/AddUser";
import AddCost from "./components/costs/AddCost";
import useOpenModal from "./services/useOpenModel";

// Add new users to mongoDb
const addUser = (newUser) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      maritalStatus: newUser.maritalSatus,
      birthday: newUser.birthday,
    }),
  };

  fetch("http://localhost:1500/users/insert-or-update-user", requestOptions)
    .then((result) => result.json())
    .then((body) => {});
};

//Add new cost to user in MongoDb
const addCostServer = (newCost, selectedUser) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newCost.name,
      description: newCost.description,
      category: newCost.category,
      year: newCost.year,
      month: newCost.month,
      sum: newCost.cost,
      userId: selectedUser.id,
    }),
  };
  fetch("http://localhost:1500/costs/insert", requestOptions)
    .then((result) => result.json())
    .then((body) => {});
};

//delete user and all of his related costs from MongoDb
const deleteUserFromDb = (_id) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  console.log(_id);

  fetch(`http://localhost:1500/users/delete-user/${_id}`, requestOptions).then((result) =>
    result.json(),
  );
};

let initUsers = [];

function App() {
  //get users from mongoDb
  const getUsers = () => {
    fetch("http://localhost:1500/users/")
      .then((result) => result.json())
      .then((body) => {
        //initialize users in client side
        setUsers(body);
        setFilteredUsers(body);
      });
  };

  //get costs of specific user from mongodb
  const getCosts = (id) => {
    fetch(`http://localhost:1500/costs/get-user-costs/${id}`)
      .then((result) => result.json())
      .then((body) => {
        //initialize costs of user in client side
        setCosts(body);
      });
  };

  //initialize users whenever main-page get refreshed
  useEffect(() => {
    getUsers();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);
  const [tempCosts, setCosts] = useState([]);
  const [users, setUsers] = useState(initUsers);
  const [filteredUsers, setFilteredUsers] = useState(initUsers);
  const [userInfoVisible, setShowUserInfo, setHideUserInfo] = useOpenModal(false);
  const [addUserVisible, setShowAddUser, setHideAddUser] = useOpenModal(false);
  const [addCostVisible, setShowAddCost, setHideAddCost] = useOpenModal(false);

  //Update filterd users whenever users array changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const deleteUser = (id) => {
    setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter((user) => user.id !== id);
      return updatedUsers;
    });
    deleteUserFromDb(id);
  };

  //Show popup of user info and the user costs
  const showInfoHandler = (user) => {
    setSelectedUser(user);
    setShowUserInfo();
    getCosts(user.id);
  };

  //show popup of adding a new cost to a user
  const showAddCostHandler = (user) => {
    setSelectedUser(user);
    setShowAddCost(true);
  };

  //fliter users by the search string
  const onSearchChange = (value) => {
    setFilteredUsers(
      users.filter((user) => {
        const temp = `${user.firstName}${user.lastName}`;
        return temp.toLowerCase().includes(value.replace(/\s/g, "").toLowerCase());
      }),
    );
  };

  //adding new user to DB and updating the existing arrays of users and filterdUsers when add user pop-up closed
  const onCloseAddUserPopup = (params) => {
    setHideAddUser();
    addUser(params.newUser);
    if (params.newUser) {
      setUsers((prevValue) => {
        return [...prevValue, params.newUser];
      });
      setFilteredUsers((prevValue) => {
        return [...prevValue, params.newUser];
      });
    }
  };

  //hide popup and execute relevant methods
  const addCostSuccessHandler = (newCost, selectedUser) => {
    //adding new cost to DB
    addCostServer(newCost, selectedUser);
    setHideAddCost();
  };



  return (
    <div className="content">
      <div className="header">
        <Search onSearchChange={onSearchChange}></Search>
        <Button variant="primary" onClick={setShowAddUser}>
          Add User
        </Button>
        {addUserVisible && <AddUser onClosePopup={onCloseAddUserPopup} show={true}></AddUser>}
      </div>

      <div className="users">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <Card.Img variant="top" src={Avatar} />
            <Card.Body>
              <UserItem key={user.id} user={user} onShowInfo={showInfoHandler} />
              <Button variant="outline-primary" onClick={() => showAddCostHandler(user)}>
                Add Cost
              </Button>
              <Button variant="outline-primary" onClick={() => deleteUser(user.id)}>
                Delete User
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <AddCost
        onClose={setHideAddCost}
        onSuccess={addCostSuccessHandler}
        show={addCostVisible}
        selectedUser={selectedUser}
      />

      <UserInfo
        show={userInfoVisible}
        onClose={setHideUserInfo}
        selectedUser={selectedUser}
        //costs={costs}
        costs={tempCosts}
      />
    </div>
  );
}

export default App;
