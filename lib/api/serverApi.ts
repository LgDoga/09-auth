import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
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

async function getCookieHeader() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search: search || undefined, tag },
    headers: await getCookieHeader(),
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: await getCookieHeader(),
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me", {
    headers: await getCookieHeader(),
  });
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse<User | "">> {
  return api.get<User | "">("/auth/session", {
    headers: await getCookieHeader(),
  });
}
