import { Issue, Project } from "@linear/sdk"

const UNASSIGNED = "Unassigned"

const assigneeMap = new Map()

export const getIssueAssignee = async (issue: Issue): Promise<string> => {

  if (!issue._assignee) {
    return UNASSIGNED
  }

  if (assigneeMap.has(issue._assignee.id)) {
    return assigneeMap.get(issue._assignee.id)
  }

  const assignedTo = (await issue.assignee).name

  assigneeMap.set(issue._assignee.id, assignedTo)

  return assignedTo

}

export const fetchIssuesForProjects = async (projects: Project[]) => {
  const projectsWithIssues = [];

  for (let project of projects) {

    const projectWithResolvedDeps = {
      ...project,
      issues: <any>[]
    }
    
    const issues = (await project.issues()).nodes
    
    for (let issue of issues) {
      projectWithResolvedDeps.issues.push({
        ... issue,
        assignedTo: await getIssueAssignee(issue)
      })
    }

    projectsWithIssues.push(projectWithResolvedDeps);
  }

  return projectsWithIssues;
};