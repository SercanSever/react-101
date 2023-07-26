import Header from "./Header.js";
import Content from "./Content";
import Footer from "./Footer";
import AddItem from "./AddItem.js";
import SearchItem from "./SearchItem.js";
import { useState, useEffect } from "react";

function App() {
  const API_URL = "http://localhost:4000/items";

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);

  // async
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw Error("Did not receive expected data");
        }
        const listItems = await response.json();
        console.log(listItems);
        setItems(listItems);
        setFetchError(null);
      } catch (error) {
        setFetchError(error.message);
      }
    };
    setTimeout(() => {
      (async () => await fetchItems())();
    }, 2);
  }, []);

  const setAndSaveItems = (newItems) => {
    setItems(newItems);
  };

  const handleCheck = (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setAndSaveItems(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setAndSaveItems(listItems);
  };

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const newListItem = { id, checked: false, item };
    const listItems = [...items, newListItem];
    setAndSaveItems(listItems);
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
        {fetchError && (
          <p style={{ color: "red" }}>{`Error : ${fetchError}`}</p>
        )}
        {!fetchError && (
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
