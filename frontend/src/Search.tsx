import React, { useEffect, useState } from "react";
import { Data } from "./types";
import { toast } from "sonner";
import { searchData } from "./services/search";
import { useDebounce } from "@uidotdev/usehooks";

const DEBOUNCE_TIME = 500;

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") ?? "";
  });

  //delay to limit search api petitions
  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  //url management
  useEffect(() => {
    const newPathName =
      debouncedSearch === ""
        ? window.location.pathname
        : `?q=${debouncedSearch}`;
    window.history.pushState({}, "", newPathName);
  }, [debouncedSearch]);

  //filter data in backend (api)
  useEffect(() => {
    if (!debouncedSearch) {
      setData(initialData);
      return;
    }
    searchData(debouncedSearch).then((response) => {
      const [err, newData] = response;
      if (err) {
        toast.error(err.message);
        return;
      }
      if (newData) {
        setData(newData);
      }
    });
  }, [debouncedSearch, initialData]);

  return (
    <div>
      <h3>Search</h3>
      <form>
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Search info..."
          defaultValue={search}
        />
      </form>
      {
        <ul>
          {data.map((row, index) => {
            return (
              <li key={index}>
                <article>
                  <ul>
                    {Object.entries(row).map(([key, value]) => {
                      return (
                        <li key={key}>
                          <strong>{key}</strong>: {value}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>
      }
    </div>
  );
};
