import { Table, printTable } from "console-table-printer"
import { FINISHED, IN_PROGRESS, NOT_STARTED } from "./domain/statuses.js"

export const alternateRowColor = (rowIndex: number) => ({color: rowIndex % 2 === 0 ? "yellow" : "green"})

export const statusBasedRowColor = (status: string) => ({
  color: status === IN_PROGRESS ? "yellow" : status === FINISHED ? "green" : status === NOT_STARTED ? "red" : "white"
})

export const printProjectsWithIssues = (projects: []) => projects.forEach(({
  name,
  startedAt,
  updatedAt,
  targetDate,
  businessDaysRemaining,
  finishedIssues,
  remainingIssues,
  issues,
  completionPercentage,
  daysToFinishATask,
  expectedFinishDate
}) => {

  printTable([{
    "Project Name": name,
    "Start Date": startedAt,
    "Last Update Date": updatedAt,
    "Target Date": targetDate,
    "Days Remaining": businessDaysRemaining,
    "Finished Issues": finishedIssues,
    "Remaining Issues": remainingIssues,
    "Completion %": completionPercentage,
    "Avg. Days Spent On A Task": daysToFinishATask,
    "Expected Finish Date": expectedFinishDate
  }])

  const p = new Table();

  issues.sort((a, b) => a.status.localeCompare(b.status)).forEach(({
      title,
      startedAt,
      completedAt,
      canceledAt,
      createdAt,
      daysFromStartToCompletion,
      daysFromCreationToStart,
      description,
      status,
      daysFromCreation,
      assignedTo
    }, index) => {

      p.addRow({
        "Title": title,
        "Status": status,
        // "Created at": createdAt,
        // "Started at": startedAt,
        // "Completed at": completedAt,
        "Elapsed days from creation": daysFromCreation,
        "Elapsed days to start date": daysFromCreationToStart,
        "Effort days": daysFromStartToCompletion,
        "Assigned to": assignedTo
      }, statusBasedRowColor(status))

    })

  p.printTable()

})