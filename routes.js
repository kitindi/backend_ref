import express from "express";
import { allNotes, searchNotes, getNoteById } from "./controller.js";

const router = express.Router();

router.get("/notes", allNotes);
router.get("/search_notes", searchNotes);
router.get("/notes/:noteId", getNoteById);

export default router;
