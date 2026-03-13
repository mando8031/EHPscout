import axios from "axios";

const API_KEY = "PUT_YOUR_TBA_KEY_HERE";

const api = axios.create({
  baseURL: "https://www.thebluealliance.com/api/v3",
  headers: {
    "X-TBA-Auth-Key": API_KEY
  }
});

export const getEvents = async (year) => {
  const res = await api.get(`/events/${year}`);
  return res.data;
};

export const getMatches = async (eventKey) => {
  const res = await api.get(`/event/${eventKey}/matches/simple`);
  return res.data;
};
