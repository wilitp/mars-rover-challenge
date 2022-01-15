import { v4 as uuidv4 } from "uuid";

export type Bookmark = {
  camera: string;
  date: string;
  sol: string;
  useSol: boolean;
  rover: string;
};

export type Bookmarks = {
  [id: string]: Bookmark;
};

export const storageId = "rover-photos-bookmarks";

function initEmptyDb() {
  const defaultBkms = "{}";
  localStorage.setItem(storageId, defaultBkms);
  return {};
}

export function getBookmarks(): Bookmarks {
  // Get db
  const rawBkms = localStorage.getItem(storageId);

  // Initialize empty db if null
  if (!rawBkms) {
    return initEmptyDb();
  }

  // Initialize empty db if corrupted
  try {
    const bkms = JSON.parse(rawBkms);
    return bkms;
  } catch {
    return initEmptyDb();
  }
}

export function saveBookmark(bk: Bookmark): Bookmarks {
  const bkms = getBookmarks();
  bkms[uuidv4()] = bk;
  localStorage.setItem(storageId, JSON.stringify(bkms));
  return bkms;
}

export function deleteBookmark(id: string): Bookmarks {
  const bkms = getBookmarks();
  // Delete by id
  const { [id]: _, ...rest } = bkms;
  localStorage.setItem(storageId, JSON.stringify(rest));
  return rest;
}
