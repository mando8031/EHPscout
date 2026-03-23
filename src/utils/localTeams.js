const TEAMS_KEY = "teams";

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createTeam(name, owner) {

  const teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];

  const newTeam = {
    id: Date.now().toString(),
    name,
    code: generateCode(),
    members: [owner]
  };

  teams.push(newTeam);
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));

  return newTeam;
}

export function joinTeamWithCode(code, username) {

  const teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];

  const team = teams.find(t => t.code === code);

  if (!team) throw new Error("Invalid code");

  if (!team.members.includes(username)) {
    team.members.push(username);
  }

  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
}

export function getTeams() {
  return JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
}
