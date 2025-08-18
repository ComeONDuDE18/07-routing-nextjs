import { fetchNotes } from "../../lib/api";
import NotesClient from "./Notes.client";


export default async function Page() {
  const initialData = await fetchNotes(1, 12, "");

  return <NotesClient initialData={initialData} />;
}
