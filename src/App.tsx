import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { roverPhotos } from "./api";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SelectChangeEvent, styled } from "@mui/material";
import Cockpit from "./components/Cockpit/Cockpit";
import {
  Bookmarks,
  getBookmarks,
  saveBookmark,
  deleteBookmark,
  Bookmark,
} from "./bookmarks";

import { Photo } from "./types";

function App() {
  // Bookmarks' state
  const [bookmarks, setBookmarks] = useState<Bookmarks>({});

  // Controls' state
  const [camera, setCamera] = useState<string>("all");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [sol, setSol] = useState<string>("1000");
  const [useSol, setUseSol] = useState<boolean>(true);
  const [rover, setRover] = useState<string>("curiosity");

  // Last page reached
  const page = useRef<number>(1);

  // Photos' state
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  // Did we reach the bottom?
  const [bottomed, setBottomed] = useState<boolean>(false);

  // Are we fetching photos?
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleLoadMore = () => {
    page.current += 1;
    setIsFetching(true);
    const cb = (data: Photo[]) => {
      if (!photos) {
        setPhotos(data);
        return;
      }
      if (data.length === 0) {
        setBottomed(true);
        setIsFetching(false);
        return;
      }
      const newPhotos = photos.concat(data);
      setPhotos(newPhotos);
      setIsFetching(false);
    };

    if (useSol) {
      roverPhotos(page.current, camera, rover, undefined, sol).then(cb);
    } else {
      roverPhotos(page.current, camera, rover, date, undefined).then(cb);
    }
  };

  // Fetch and display on new selection
  useEffect(() => {
    setIsFetching(true);
    setBottomed(false);
    if (useSol) {
      roverPhotos(page.current, camera, rover, undefined, sol).then((data) => {
        setPhotos(data);
        setIsFetching(false);
      });
    } else {
      roverPhotos(page.current, camera, rover, date).then((data) => {
        setPhotos(data);
        setIsFetching(false);
      });
    }
  }, [camera, date, sol, useSol, rover]);

  const images = useMemo(() => {
    if (!photos) return;
    return photos.map((p) => (
      <img
        loading="lazy"
        alt={`${p.rover.name} - ${p.camera.name}, ${p.earth_date}`}
        style={{ display: "block" }}
        key={p.img_src}
        src={p.img_src}
      ></img>
    ));
  }, [photos]);

  function handleCameraChange(e: SelectChangeEvent) {
    setCamera(e.target.value);
  }

  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    setDate(e.target.value);
  }

  function handleSolChange(e: ChangeEvent<HTMLInputElement>) {
    setSol(e.target.value);
  }

  function handleUseSolChange(e: ChangeEvent<HTMLInputElement>) {
    setUseSol(e.target.checked);
  }

  function handleRoverChange(e: SelectChangeEvent<string>) {
    setRover(e.target.value);
  }

  const StyledStack = styled(Stack)`
    max-width: 800px;
    margin: auto;
  `;

  function addBookmark() {
    const bk: Bookmark = {
      useSol,
      rover,
      date,
      sol,
      camera,
    };
    const bkms = saveBookmark(bk);
    setBookmarks(bkms);
  }

  function removeBookmark(id: string) {
    const bkms = deleteBookmark(id);
    setBookmarks(bkms);
  }

  function loadBookmark(bk: Bookmark) {
    setUseSol(bk.useSol);
    setRover(bk.rover);
    setDate(bk.date);
    setCamera(bk.camera);
    setSol(bk.sol);
  }

  return (
    <Container style={{ maxWidth: "600px" }}>
      <Typography variant="h2" component="h1">
        Mars Rovers' Photos
      </Typography>
      <Cockpit
        loadBookmark={loadBookmark}
        removeBookmark={removeBookmark}
        addBookmark={addBookmark}
        bookmarks={bookmarks}
        rover={rover}
        date={date}
        sol={sol}
        camera={camera}
        useSol={useSol}
        handleCameraChange={handleCameraChange}
        handleRoverChange={handleRoverChange}
        handleDateChange={handleDateChange}
        handleUseSolChange={handleUseSolChange}
        handleSolChange={handleSolChange}
      />
      {!images ? (
        <p>Loading...</p>
      ) : images.length === 0 ? (
        <Typography variant="body1">No photos available</Typography>
      ) : (
        <StyledStack spacing={2}>
          {images as any}

          {!bottomed ? (
            <Button variant="text" onClick={handleLoadMore}>
              Load More
            </Button>
          ) : null}
          {isFetching && !bottomed ? (
            <Typography variant="body1">Loading more...</Typography>
          ) : null}
        </StyledStack>
      )}
    </Container>
  );
}

export default App;
