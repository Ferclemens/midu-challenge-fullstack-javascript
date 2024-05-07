import { useState } from "react";
import "./App.css";

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
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status != APP_STATUS.READY_UPLOAD || !file) {
      return;
    }
    setStatus(APP_STATUS.UPLOADING);
  }

  const showButton =
    status === APP_STATUS.READY_UPLOAD || status === APP_STATUS.UPLOADING;

  return (
    <>
      <h3>Challenge: Upload CSV + search</h3>
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
    </>
  );
}

export default App;
