import { today, dateDiff, daysUntil, yyyyMMDD, dateAdd } from "./date-utils.js";

import { IN_PROGRESS, FINISHED, NOT_STARTED } from "./domain/statuses.js";
import { printProjectsWithIssues } from "./ui.js";
import { getCurrentUserTeamByName } from "./domain/user.js";
import { getOngoingProjectsFromTeam } from "./domain/project.js";
import { fetchIssuesForProjects } from "./domain/issue.js";

const currentUserTeam = await getCurrentUserTeamByName("Ngage");

const ongoingProjects = await getOngoingProjectsFromTeam(currentUserTeam);
const ongoingProjectsWithIssues = await fetchIssuesForProjects(ongoingProjects);

const progress = ongoingProjectsWithIssues.map(
  ({ id, name, startedAt, updatedAt, targetDate, issues }) => {
    const issuesProgress = issues.map(
      ({
        startedAt,
        assignedTo,
        completedAt,
        canceledAt,
        createdAt,
        description,
        title,
      }) => ({
        title,
        startedAt: yyyyMMDD(startedAt),
        completedAt: yyyyMMDD(completedAt),
        canceledAt: yyyyMMDD(canceledAt),
        createdAt: yyyyMMDD(createdAt),
        daysFromStartToCompletion: completedAt ? dateDiff(startedAt, completedAt) : dateDiff(startedAt, today()),
        daysFromCreationToStart: dateDiff(createdAt, startedAt),
        assignedTo,
        description,
        status: completedAt ? FINISHED : startedAt ? IN_PROGRESS : NOT_STARTED,
        daysFromCreation: dateDiff(createdAt, today())
      })
    );

    const finishedIssues = issuesProgress.filter(issue => issue.completedAt).reduce((finishedIssueCount) => (
      finishedIssueCount + 1
    ), 0)

    const remainingIssues = issuesProgress.filter(issue => !issue.completedAt).reduce((remainingIssueCount) => (
      remainingIssueCount + 1
    ), 0)

    const completionPercentage = Math.round(finishedIssues / (finishedIssues + remainingIssues) * 100)

    const daysToFinishATask = finishedIssues / dateDiff(startedAt, today())

    const progress = {
      id,
      name,
      startedAt: yyyyMMDD(startedAt),
      updatedAt: yyyyMMDD(updatedAt),
      targetDate: yyyyMMDD(targetDate),
      issues: issuesProgress,
      businessDaysRemaining: daysUntil(targetDate),
      finishedIssues,
      remainingIssues,
      completionPercentage,
      daysToFinishATask,
      expectedFinishDate: dateAdd(today(), remainingIssues / daysToFinishATask)
    };

    return progress;
  }
);

printProjectsWithIssues(progress)