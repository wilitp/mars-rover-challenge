const apiKey = process.env.REACT_APP_NASA_API_KEY;
const apiUrl = "https://api.nasa.gov/mars-photos/api/v1/";

export const roverPhotos = async (page: number, camera: string, rover:string, earthDate?: string, sol?: string ) => {
  const headers: Headers = new Headers({
    Accept: "application/json",
  });

  const config: RequestInit = {
    method: "GET",
    mode: "cors",
    headers,
  };

  let res = null;
  res = await fetch(`${apiUrl}rovers/${rover}/photos?${sol ? `sol=${sol}` : `earth_date=${earthDate}`}${camera !== "all" ? `&camera=${camera}` : ""}&page=${page}&api_key=${apiKey}`, config);

  if(!res.ok) {
    throw Error(`Error while fetching photos: status: ${res.status}`);
  }

  const {photos} = await res.json();

  return photos;
};
