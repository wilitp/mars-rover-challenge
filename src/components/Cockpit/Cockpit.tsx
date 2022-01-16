import React, { FC, useMemo } from "react";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Bookmarks } from "../../bookmarks";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

interface CockpitProps {
  useSol: boolean;
  rover: string;
  sol: string;
  date: string;
  camera: string;
  bookmarks: Bookmarks;
  addBookmark: Function;
  loadBookmark: Function;
  removeBookmark: Function;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUseSolChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSolChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoverChange: (e: SelectChangeEvent) => void;
  handleCameraChange: (e: SelectChangeEvent) => void;
}

const rovers = ["curiosity", "spirit", "opportunity"];
const cameras = {
  fhaz: "Front Hazard Avoidance Camera",
  rhaz: "Rear Hazard Avoidance Camera",
  mast: "Mast Camera",
  chemcam: "Chemistry and Camera Complex",
  mahli: "Mars Hand Lens Imager",
  mardi: "Mars Descent Imager",
  navcam: "Navigation Camera",
  pancam: "Panoramic Camera",
  minites: "Miniature Thermal Emission Spectrometer (Mini-TES)",
};
const label = { inputProps: { "aria-label": "controlled" } };

const Cockpit: FC<CockpitProps> = ({
  date,
  rover,
  sol,
  useSol,
  camera,
  bookmarks,
  removeBookmark,
  loadBookmark,
  addBookmark,
  handleDateChange,
  handleUseSolChange,
  handleSolChange,
  handleRoverChange,
  handleCameraChange,
}) => {
  // ---- Bookmarks logic -------------------------
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const noBookmarks = useMemo(() => Object.keys(bookmarks).length === 0, [
    bookmarks,
  ]);

  // Open Bookmarks
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (noBookmarks) return;
    setAnchorEl(event.currentTarget);
  };

  // Close Bookmarks
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Delete a Bookmark
  const handleBookmarkDeletion = (b: string) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    removeBookmark(b);
    setAnchorEl(null);
  };

  return (
    <Box marginTop={3} marginBottom={3}>
      {/* Sol switch */}
      <Box marginBottom={1}>
        <FormControlLabel
          control={
            <Switch
              checked={useSol}
              {...label}
              value={useSol}
              onChange={handleUseSolChange}
            />
          }
          label="Use Sol"
        />
      </Box>

      {/* Date / sol selection */}
      <Box marginBottom={1}>
        <TextField
          value={date}
          type="date"
          label="Date"
          id="date-input"
          onChange={handleDateChange}
          disabled={useSol}
        />
        <TextField
          value={sol}
          onChange={handleSolChange}
          type="number"
          label="Sol"
          defaultValue={1}
          id="sol-input"
          disabled={!useSol}
        />
      </Box>

      {/* Rover and camera selection */}
      <Box marginBottom={1}>
        <FormControl>
          <InputLabel id="camera-select-label">Rover</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={rover}
            label="Rover"
            onChange={handleRoverChange}
          >
            {rovers.map((r) => (
              <MenuItem value={r} key={r}>
                {r.slice(0, 1).toUpperCase() + r.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="camera-select-label">Camera</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={camera}
            label="Camera"
            onChange={handleCameraChange}
          >
            <MenuItem value={"all"}>All</MenuItem>
            {Object.keys(cameras).map((k) => (
              <MenuItem value={k} key={k}>
                {cameras[k as keyof typeof cameras]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Bookmarks */}
        {noBookmarks ? null : (
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Bookmarks
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {Object.keys(bookmarks).map((b) => (
                <MenuItem
                  value={b}
                  key={b}
                  onClick={() => loadBookmark(bookmarks[b])}
                >
                  {`${bookmarks[b].rover} - ${
                    bookmarks[b].useSol ? bookmarks[b].sol : bookmarks[b].date
                  }`}{" "}
                  <div style={{ marginLeft: "auto" }}>
                    <CloseIcon
                      onClick={handleBookmarkDeletion(b) as any}
                      component="svg"
                    />
                  </div>
                </MenuItem>
              ))}
            </Menu>
          </div>
        )}
      </Box>

      {/* Add bookmark */}
      <Box>
        <Button onClick={addBookmark as any} variant="contained">
          Bookmark current
        </Button>
      </Box>
    </Box>
  );
};

export default Cockpit;
