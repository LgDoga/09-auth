"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import type { NoteTag } from "../../types/note";
import { createNote } from "../../lib/api/clientApi";
import { useNoteStore } from "../../lib/store/noteStore";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
  });

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({ [event.target.name]: event.target.value });
  };

  const handleSubmit = (formData: FormData) => {
    mutate({
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      tag: formData.get("tag") as NoteTag,
    });
  };

  const handleCancel = () => router.back();

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
