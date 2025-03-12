export const allNotes = (req, res) => {
  res.json({ message: "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
};

export const getNoteById = (req, res) => {
  const noteId = req.params.noteId;
  res.json({ message: `Welcome to EasyNotes application. This is notes ${noteId}. Organize and keep track of all your notes.` });
};

export const searchNotes = (req, res) => {
  const searched_notes = req.query.keyword;
  res.json({ message: `Welcome to EasyNotes application.You are searching for ${searched_notes}` });
};
