import { LinearClient, LinearFetch, User } from "@linear/sdk";

const getCurrentUserPartial = (linearClient: LinearClient) => async (): LinearFetch<User> => linearClient.viewer;

export const getCurrentUser = getCurrentUserPartial(new LinearClient({ apiKey: process.env.API_KEY }))

export const getCurrentUserTeamByName = async (name: string) => {
  const currentUser = await getCurrentUser();
  const currentUserTeams = await currentUser.teams();
  const currentUserTeamMatchingName = currentUserTeams.nodes.find(
    (team) => team.name === name
  );

  return currentUserTeamMatchingName;
};