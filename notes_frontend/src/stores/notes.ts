import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Note, NoteCreatePayload, NoteUpdatePayload } from "@/api/notes";
import * as api from "@/api/notes";

/**
 * Pinia store for managing notes' state and syncing with backend.
 */
export const useNotesStore = defineStore("notes", () => {
  const notes = ref<Note[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const activeNoteId = ref<string | null>(null);
  const organizationFilter = ref<string | null>(null);

  // Getters
  const allNotes = computed(() => notes.value);
  const filteredNotes = computed(() => {
    return organizationFilter.value
      ? notes.value.filter((n) => n.organization === organizationFilter.value)
      : notes.value;
  });
  const activeNote = computed(() =>
    notes.value.find((n) => n.id === activeNoteId.value) || null
  );
  const organizations = computed(() => {
    const orgSet = new Set<string>();
    notes.value.forEach((n) => {
      if (n.organization) orgSet.add(n.organization);
    });
    return Array.from(orgSet);
  });

  // Actions

  // PUBLIC_INTERFACE
  /** Fetch all notes, or filter by organization */
  async function fetchNotes(organization?: string) {
    loading.value = true;
    error.value = null;
    try {
      notes.value = await api.fetchNotes(organization);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        error.value = (e as { message: string }).message || "Failed to fetch notes.";
      } else {
        error.value = "Failed to fetch notes.";
      }
    } finally {
      loading.value = false;
    }
  }

  // PUBLIC_INTERFACE
  /** Fetch a note by ID and add/update in store */
  async function fetchNote(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const note = await api.fetchNoteById(id);
      const idx = notes.value.findIndex((n) => n.id === id);
      if (idx !== -1) {
        notes.value[idx] = note;
      } else {
        notes.value.push(note);
      }
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        error.value = (e as { message: string }).message || "Failed to fetch note.";
      } else {
        error.value = "Failed to fetch note.";
      }
    } finally {
      loading.value = false;
    }
  }

  // PUBLIC_INTERFACE
  /** Create a new note and add to store */
  async function createNote(input: NoteCreatePayload) {
    loading.value = true;
    error.value = null;
    try {
      const newNote = await api.createNote(input);
      notes.value.unshift(newNote);
      activeNoteId.value = newNote.id;
      return newNote;
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        error.value = (e as { message: string }).message || "Failed to create note.";
      } else {
        error.value = "Failed to create note.";
      }
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // PUBLIC_INTERFACE
  /** Update a note (partial) */
  async function updateNote(id: string, input: NoteUpdatePayload) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await api.updateNote(id, input);
      const idx = notes.value.findIndex((n) => n.id === id);
      if (idx !== -1) {
        notes.value[idx] = updated;
      } else {
        // not found, add as fallback
        notes.value.push(updated);
      }
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        error.value = (e as { message: string }).message || "Failed to update note.";
      } else {
        error.value = "Failed to update note.";
      }
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // PUBLIC_INTERFACE
  /** Delete a note by ID */
  async function deleteNote(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.deleteNote(id);
      notes.value = notes.value.filter((n) => n.id !== id);
      if (activeNoteId.value === id) activeNoteId.value = null;
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        error.value = (e as { message: string }).message || "Failed to delete note.";
      } else {
        error.value = "Failed to delete note.";
      }
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // PUBLIC_INTERFACE
  /** Search notes by query and update notes list */
  async function searchNotes(query: string, organization?: string) {
    loading.value = true;
    error.value = null;
    try {
      notes.value = await api.searchNotes(query, organization);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        error.value = (e as { message: string }).message || "Failed to search notes.";
      } else {
        error.value = "Failed to search notes.";
      }
    } finally {
      loading.value = false;
    }
  }

  // PUBLIC_INTERFACE
  /** Set organization filter for displaying notes */
  function setOrganizationFilter(org: string | null) {
    organizationFilter.value = org;
  }

  // PUBLIC_INTERFACE
  /** Set current active note id */
  function setActiveNote(id: string | null) {
    activeNoteId.value = id;
  }

  return {
    notes,
    loading,
    error,
    activeNoteId,
    allNotes,
    filteredNotes,
    activeNote,
    organizations,
    organizationFilter,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    setOrganizationFilter,
    setActiveNote,
  };
});
