const express = require("express");
const app = express();
const fs = require("node:fs");
const path = require("path");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    res.render("index", { files: files });
    console.log(files);
  });
});

app.get("/files/:fileName", (req, res) => {
  fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err, fileData) => {
    res.render("show", { fileData: fileData });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.detail,
    (err) => {
      res.redirect("/");
    }
  );
});

app.post("/delete/:filename", (req, res) => {
  const fileToDelete = req.params.filename;
  const filePath = path.join(__dirname, `/files/${fileToDelete}`); 
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send("Error deleting file.");
    }
    console.log("File deleted:", fileToDelete);
    res.redirect("/"); 
  });
});

app.listen(port, () => {
  console.log(` Server is running on port : http://localhost:${port}`);
});
