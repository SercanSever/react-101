import Header from "./Header.js";
import Content from "./Content";
import Footer from "./Footer";
import AddItem from "./AddItem.js";
import SearchItem from "./SearchItem.js";
import { useState, useEffect } from "react";
import apiRequest from "./apiRequest.js";

function App() {
  const API_URL = "http://localhost:4000/items";

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // async
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw Error("Did not receive expected data");
        }
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      (async () => await fetchItems())();
    }, 250);
  }, []);

  const setAndSaveItems = (newItems) => {
    setItems(newItems);
  };

  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setAndSaveItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: myItem[0].checked }),
    };
    const requestUrl = `${API_URL}/${id}`;
    const result = await apiRequest(requestUrl, updateOptions);
    if (result) {
      setFetchError(result);
    }
  };

  const handleDelete = async (id) => {
    const myItem = items.filter((item) => item.id === id);
    const listItems = items.filter((item) => item.id !== id);
    setAndSaveItems(listItems);
    const deleteOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: myItem[0].id }),
    };
    const requestUrl = `${API_URL}/${id}`;
    const result = await apiRequest(requestUrl, deleteOptions);
    if (result) {
      setFetchError(result);
    }
  };

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const newListItem = { id, checked: false, item };
    const listItems = [...items, newListItem];
    setAndSaveItems(listItems);
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newListItem),
    };
    const result = await apiRequest(API_URL, postOptions);
    if (result) {
      setFetchError(result);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      {/* Overrides Header.defaultProps */}
      <Header title="Hello World!" />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && (
          <p style={{ color: "red" }}>{`Error : ${fetchError}`}</p>
        )}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <SearchItem search={search} setSearch={setSearch} />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <Footer length={items.length} />
    </div>
  );
}

export default App;
