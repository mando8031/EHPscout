const TEAMS_KEY = "teams";

export function createTeam(name) {
  const teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];

  const newTeam = {
    id: Date.now().toString(),
    name,
    members: []
  };

  teams.push(newTeam);
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));

  return newTeam;
}

export function joinTeam(teamId, username) {
  const teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];

  const team = teams.find(t => t.id === teamId);
  if (!team) throw new Error("Team not found");

  if (!team.members.includes(username)) {
    team.members.push(username);
  }

  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
}

export function getTeams() {
  return JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
}
