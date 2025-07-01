//
// Notes API utility for interacting with the backend REST API (/api/notes).
// This module provides CRUD, search, and organizational operations for notes.
//

import axios from "axios";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  organization?: string; // e.g., folder/category/tag
}

export interface NoteCreatePayload {
  title: string;
  content: string;
  organization?: string;
}

export interface NoteUpdatePayload {
  title?: string;
  content?: string;
  organization?: string;
}

// Base URL resolves from Vite configuration/env, fallback to a proxy/api as needed.
const BASE_URL = import.meta.env.VITE_API_URL || "/api/notes";

// PUBLIC_INTERFACE
/**
 * Fetch all notes, optionally filtered by organization/folder/tag.
 */
export async function fetchNotes(organization?: string): Promise<Note[]> {
  const params = organization ? { organization } : {};
  const { data } = await axios.get<Note[]>(BASE_URL, { params });
  return data;
}

// PUBLIC_INTERFACE
/** Get a single note by id */
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await axios.get<Note>(`${BASE_URL}/${id}`);
  return data;
}

// PUBLIC_INTERFACE
/** Create a new note */
export async function createNote(payload: NoteCreatePayload): Promise<Note> {
  const { data } = await axios.post<Note>(BASE_URL, payload);
  return data;
}

// PUBLIC_INTERFACE
/** Update an existing note */
export async function updateNote(id: string, payload: NoteUpdatePayload): Promise<Note> {
  const { data } = await axios.put<Note>(`${BASE_URL}/${id}`, payload);
  return data;
}

// PUBLIC_INTERFACE
/** Delete a note by id */
export async function deleteNote(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`);
}

// PUBLIC_INTERFACE
/** Search notes by query (fulltext search on title/content) */
export async function searchNotes(query: string, organization?: string): Promise<Note[]> {
  const params: Record<string, string> = { q: query };
  if (organization) params.organization = organization;
  const { data } = await axios.get<Note[]>(`${BASE_URL}/search`, { params });
  return data;
}
