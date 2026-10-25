import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../../lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;
  const description =
    note.content.length > 100
      ? `${note.content.slice(0, 100)}...`
      : note.content || "Note details in NoteHub.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
