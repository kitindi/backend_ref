import multer from "multer";

export const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // modify the uploaded file name
    cb(null, file.fieldname + "_" + Date.now() + file.originalname);
  },
});
