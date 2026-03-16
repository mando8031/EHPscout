const BASE = "https://www.thebluealliance.com/api/v3";

const headers = {
  "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
};

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const text = await res.text();
      console.error("TBA API error:", res.status, text);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected API response:", data);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}

export async function getEvents(year) {
  return safeFetch(`${BASE}/events/${year}`);
}

export async function getMatches(eventKey) {
  return safeFetch(`${BASE}/event/${eventKey}/matches`);
}
