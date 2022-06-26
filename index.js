const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
const helmet = require("helmet").default;

const anime = require("./routers/anime");
const manga = require("./routers/manga");

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/anime", anime);
app.use("/manga", manga);

app.use("/", (req, res) => {
  res.send({
    status: true,
    message:
      "For more info, check out https://github.com/tustoz/manganim",
    find_me_on: {
      tiktok: "https://tiktok.com/@tustoz",
      facebook: "https://facebook.com/tustozy/",
      instagram: "https://instagram.com/maxi.aditya",
      github: "https://github.com/tustoz/manganim",
    },
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "api path not found",
  });
});

app.listen(PORT, () => {
  console.log("Listening on PORT:" + PORT);
});
