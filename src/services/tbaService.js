const BASE = "https://www.thebluealliance.com/api/v3"

const headers = {
  "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY
}

async function safeFetch(url) {
  const res = await fetch(url, { headers })

  const text = await res.text()

  try {
    return JSON.parse(text)
  } catch (err) {
    console.error("TBA returned non-JSON:", text)
    return []
  }
}

export async function getEvents(year) {
  return safeFetch(`${BASE}/events/${year}`)
}

export async function getMatches(eventKey) {
  return safeFetch(`${BASE}/event/${eventKey}/matches`)
}
