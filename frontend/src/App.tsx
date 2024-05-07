import { useState } from "react";
import "./App.css";
import { uploadFile } from "./services/upload";
import { Toaster, toast } from "sonner";
import { Data } from "./types";
import Search from "./Search";

//States for actions management in ui
const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  UPLOADING: "uploading",
  READY_UPLOAD: "ready_upload",
  READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Upload File",
  [APP_STATUS.UPLOADING]: "Uploading...",
};

//types (typescript)
type appStatusFile = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [status, setStatus] = useState<appStatusFile>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data>([]);

  //upload csv file
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const [file] = event.target.files ?? [];
    if (file) {
      setFile(file);
      setStatus(APP_STATUS.READY_UPLOAD);
    }
    console.log(file);
  }
  //send file to db
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status != APP_STATUS.READY_UPLOAD || !file) {
      return;
    }
    setStatus(APP_STATUS.UPLOADING);

    const [err, newData] = await uploadFile(file);
    console.log({ err, newData });
    if (err) {
      setStatus(APP_STATUS.ERROR);
      toast.error(err.message);
      return;
    }
    setStatus(APP_STATUS.READY_USAGE);
    if (newData) {
      setData(newData);
      toast.success("Upload file success");
    }
  };

  const showButton =
    status === APP_STATUS.READY_UPLOAD || status === APP_STATUS.UPLOADING;
  const showInput = status != APP_STATUS.READY_USAGE;
  const showSearch = status === APP_STATUS.READY_USAGE;

  return (
    <>
      <Toaster />
      <h3>Challenge: Upload CSV + search</h3>
      {showInput && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <input
                onChange={handleInputChange}
                name="file"
                type="file"
                accept=".csv"
              />
            </label>
            {showButton && (
              <button type="submit" disabled={status === APP_STATUS.UPLOADING}>
                {BUTTON_TEXT[status]}
              </button>
            )}
          </div>
        </form>
      )}
      {showSearch && <Search initialData={data} />}
    </>
  );
}

export default App;
