import { api } from "./api";
import type { Note, NoteTag } from "../../types/note";
import type { User } from "../../types/user";

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  username: string;
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search: search || undefined, tag },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(note: CreateNoteParams): Promise<Note> {
  const response = await api.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(data: AuthRequest): Promise<User> {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
}

export async function login(data: AuthRequest): Promise<User> {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User>("/auth/session");
  return response.data || null;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(data: UpdateMeRequest): Promise<User> {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
}
