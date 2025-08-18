"use client";


import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";


import css from "./Notes.module.css";
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import type { FetchNotesResponse } from "../../lib/api";

interface NotesDetailsClientProps {
  initialData: FetchNotesResponse;
}




export default function NotesDetailsClient({ initialData }: NotesDetailsClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [debouncedSearchTerm] = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

const { data, isLoading, error, isSuccess } = useQuery<FetchNotesResponse>({
  queryKey: ["notes", page, debouncedSearchTerm],
  queryFn: () => fetchNotes(page, 12, debouncedSearchTerm || ""),
  placeholderData: keepPreviousData,
    initialData,
});


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        
        <SearchBox value={search} onChange={setSearch} />

        {isLoading && <strong className={css.loading}>Loading please wait...</strong>}
      {error && <p className={css.error}>Something went wrong.{error.message}</p>}
   

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setModalIsOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isSuccess && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p>No notes found</p>
      )}

      {modalIsOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <NoteForm onClose={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}