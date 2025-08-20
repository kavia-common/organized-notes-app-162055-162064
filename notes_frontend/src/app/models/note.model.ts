/**
 * PUBLIC_INTERFACE
 * A Note entity representing a user note.
 */
export interface Note {
  /** Unique identifier for the note */
  id: string;
  /** Title of the note */
  title: string;
  /** Free-form note content (markdown/plaintext) */
  content: string;
  /** Category for organizing notes (e.g., Work, Personal) */
  category: string;
  /** Tags associated with the note */
  tags: string[];
  /** ISO string of created timestamp */
  createdAt: string;
  /** ISO string of updated timestamp */
  updatedAt: string;
}
