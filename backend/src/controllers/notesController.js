import Note from "../models/Note.js";
import { containsBannedWords } from "../lib/utils.js";
import { moderateText } from "../lib/moderate.js";

const MAX_TITLE_LENGTH = 150;
const MAX_CONTENT_LENGTH = 5000;

// Combines title and content into a single string for moderation
function buildModerationInput(title, content) {
  return `TITLE:\n${title}\n\nCONTENT:\n${content}`;
}

// Validates title and content length and banned words
function validateNoteInput(title, content) {
  if (!title || !content) {
    return { status: 400, message: "Title and content are required." };
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return { status: 422, message: `Title cannot exceed ${MAX_TITLE_LENGTH} characters.` };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { status: 422, message: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters.` };
  }
  if (containsBannedWords(title) || containsBannedWords(content)) {
    return { status: 422, message: "Your note contains prohibited or hateful language." };
  }
  return null;
}

// Handles errors thrown by the moderation service
function handleModerationError(error, res) {
  if (error?.status === 429) {
    return res.status(503).json({
      message: "Moderation is busy (rate-limited). Please try again in a moment.",
    });
  }
  if (error?.status === 404) {
    return res.status(503).json({
      message: "Moderation service misconfigured (Azure endpoint/resource not found).",
    });
  }
  return null;
}

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const validationError = validateNoteInput(title, content);
    if (validationError) {
      return res.status(validationError.status).json({ message: validationError.message });
    }

    const moderation = await moderateText(buildModerationInput(title, content));
    if (moderation.flagged) {
      return res.status(422).json({
        message: "Your note was flagged by content safety checks.",
        severities: moderation.severities,
      });
    }

    const note = new Note({ title, content });
    const savedNote = await note.save();
    return res.status(201).json(savedNote);
  } catch (error) {
    if (handleModerationError(error, res)) return;
    console.error("Error in createNote controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;

    const validationError = validateNoteInput(title, content);
    if (validationError) {
      return res.status(validationError.status).json({ message: validationError.message });
    }

    const moderation = await moderateText(buildModerationInput(title, content));
    if (moderation.flagged) {
      return res.status(422).json({
        message: "Your update was flagged by content safety checks.",
        severities: moderation.severities,
      });
    }

    await Note.findByIdAndUpdate(req.params.id, { title, content });
    return res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    if (handleModerationError(error, res)) return;
    console.error("Error in updateNote controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found!" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}