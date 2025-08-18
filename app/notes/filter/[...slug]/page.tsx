import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;

  const tag = slug[0] === "All" ? undefined : slug[0];

  const initialNotes = await fetchNotes({
    search: '',
    page: 1,
    perPage: 12,
  tag,
});
  
  return (
    <NotesClient initialData={initialNotes} tag={tag || 'All'} />
  );
}

