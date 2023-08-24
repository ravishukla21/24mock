const express = require("express");
const { NoteModel } = require("../models/note.model");
const { auth } = require("../middleware/auth.middleware");
const noteRouter = express.Router();
noteRouter.use(auth);

noteRouter.post("/create", async (req, res) => {
  //logic
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.json({ msg: "New note has been added", note: req.body });
  } catch (err) {
    res.json({ error: err.message });
  }
});

noteRouter.get("/", async (req, res) => {
  //logic
  //relationship node connection and user connection for particular type of login
  try {
    const notes = await NoteModel.find({ userID: req.body.userID });
    res.json(notes);
  } catch (err) {
    res.json({ error: err.message });
  }
});

noteRouter.patch("/update/:noteID", async (req, res) => {
  //logic=> update
  const { noteID } = req.params;
  //userID in the userdoc===userid in the note document
  const userIDinUserDoc = req.body.userID;

  try {
    const note = await NoteModel.findOne({ _id: noteID });
    const userIDinNoteDoc = note.userID;

    if (userIDinUserDoc === userIDinNoteDoc) {
      //update
      await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body);
      res.json({ msg: `${note.title} has been updated` });
    } else {
      res.json({ msg: "not authorized" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

noteRouter.delete("/delete/:noteID", async (req, res) => {
  //logic
  //logic=> update
  const { noteID } = req.params;
  console.log(noteID, "noteid");
  //userID in the user id in the note document
  const userIDinUserDoc = req.body.userID;

  try {
    const note = await NoteModel.findOne({ _id: noteID });
    const userIDinNoteDoc = note.userID;

    if (userIDinUserDoc === userIDinNoteDoc) {
      //update
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.json({ msg: `${note.title} has been deleted` });
    } else {
      res.json({ msg: "not authorized" });
    }
  } catch (err) {
    res.json({ error: err });
  }
});

noteRouter.get("/", async (req, res) => {
  try {
    let { type, category, title, page, limit, sortOrder, sortBy } = req.query;
    // let { id } = req.params;
    let filter = {};

    if (type) {
      // Convert type to an array if it's a single value
      const types = Array.isArray(type) ? type : [type];
      filter.type = { $in: types };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    page = parseInt(page);
    limit = parseInt(limit);

    const products = await NoteModel.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//implement logout using blacklisting

module.exports = { noteRouter };
