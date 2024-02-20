import express from "express";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename)
console.log(__dirname)

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "src", "frontend", "static")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src", "frontend", "index.html"));
});

app.listen(process.env.PORT || 10000, () => console.log("Server is running..."));
