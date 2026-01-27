import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const USERS_API = "http://localhost:8000/users";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    return fetch(USERS_API);
  }

  function postUser(person) {
    return fetch(USERS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  }

  function deleteUser(id) {
    return fetch(`${USERS_API}/${id}`, { method: "DELETE" });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => console.log(error));
  }, []);

  function removeOneCharacter(id) {
    deleteUser(id)
      .then((res) => {
        if (res.status === 204) {
          setCharacters(characters.filter((c) => c.id !== id));
        } else {
          console.log("Delete failed with status:", res.status);
        }
      })
      .catch((error) => console.log(error));
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) return res.json();
        throw new Error(`POST failed with status ${res.status}`);
      })
      .then((createdUser) => {
        setCharacters([...characters, createdUser]);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;

