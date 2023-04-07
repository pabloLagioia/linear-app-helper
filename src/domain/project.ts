import { Team } from "@linear/sdk";

export const getOngoingProjectsFromTeam = async (team: Team | undefined) => {
  if (!team) {
    return [];
  }
  const projects = await team.projects();
  return projects.nodes.filter(({ state }) => state === "started");
};