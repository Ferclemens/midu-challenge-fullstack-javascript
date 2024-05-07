import React, { useEffect, useState } from "react";
import { Data } from "./types";

function Search({ initialData }: { initialData: Data }) {
  const [data, setData] = useState<Data>(initialData);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (search === "") {
      window.history.pushState({}, "", window.location.pathname);
      return;
    }
    window.history.pushState({}, "", `?q=${search}`);
  }, [search]);
  return (
    <div>
      <h3>Search</h3>
      <input onChange={handleSearch} type="text" placeholder="Search info..." />
    </div>
  );
}

export default Search;
