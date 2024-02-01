import { Observable } from 'rxjs';

export type Checkpoint = {
  id: string;
  updatedAt: number;
};

export type DocumentUpdates<T> = {
  documents: T[];
  checkpoint: Checkpoint;
};

export type DocumentUpdatesEvent<T, E extends string> = DocumentUpdates<T> & {
  type: E;
};

export type DocumentChangeRow<T> = {
  newDocumentState: T;
  assumedMasterState?: T;
};

export interface UpdateEventSource<T> {
  events: Observable<DocumentUpdates<T>>;
}
