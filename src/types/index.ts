// Non exhaustive, limited to what we are using

export type Rover = {
  name: string;
};

export type Camera = {
  name: string;
};
export type Photo = {
  img_src: string;
  rover: Rover;
  earth_date: string;
  camera: Camera;
};
