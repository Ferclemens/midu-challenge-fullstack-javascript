import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express(); //init app
const port = process.env.PORT ?? 3000; //port selection

const storage = multer.memoryStorage();
const upload = multer({ storage });

let userData: Array<Record<string, string>> = [];

app.use(cors()); //enable cors

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}/`);
});

app.post("/api/files", upload.single("file"), async (req, res) => {
  //1. extract file from request
  const { file } = req;
  //2. validate that we have file
  if (!file) {
    return res.status(500).json({ message: "file don`t exist" });
  }
  //3. validate the mimetype (csv)
  if (file.mimetype != "text/csv") {
    return res.status(500).json({ message: "file must be csv" });
  }
  //4. transform file (buffer) to string
  try {
    //convert buffer to string
    const csvResult = Buffer.from(file.buffer).toString("utf-8");
    //convert string to json
    const jsonResult = csvToJson.fieldDelimiter(",").csvStringToJson(csvResult);
    console.log(jsonResult);
    //5. save the json to db (or memory)
    userData = jsonResult;
  } catch (error) {
    return res.status(500).json({ message: "error parsing csv to json file" });
  }

  //6. return 200 with the success message and the json
  return res
    .status(200)
    .json({ data: userData, message: "el archivo se cargo correctamente" });
});

app.get("/api/users", async (req, res) => {
  //1. extract the query param 'q' from the request
  const { q } = req.query;
  //2. validate that we have the query param
  if (!q) {
    return res.status(500).json({ message: "query param q is required" });
  }
  //validate if it is only strings
  if (Array.isArray(q)) {
    return res.status(500).json({ message: "q param must be a string" });
  }
  //3. filter the data from the db (or memory) with the query param
  const search = q?.toString().toLowerCase();
  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLowerCase().includes(search)
    );
  });
  //4. return 200 with the filtered data
  return res.status(200).json({ data: filteredData });
});
