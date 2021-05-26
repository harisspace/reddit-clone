import multer from "multer";
import path from "path";
import { makeid } from "../helpers";

// save image with multer
const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "./public/images");
  },
  filename: function (_, file, cb) {
    const name = makeid(4);
    cb(null, name + "-" + Date.now() + path.extname(file.originalname)); // e.g. jhddjdfjsk333433 + .jpg
  },
});

export const uploadImage = multer({
  storage,
  fileFilter: (_, file, callback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("File not image"));
    }
  },
});
