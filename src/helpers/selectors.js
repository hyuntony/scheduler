// returns an array of appointments that matches the appointments in the selected day
const getAppointmentsForDay = (state, day) => {
  const result = [];
  const appIds = state.days.filter(eachDay => eachDay.name === day);

  if (appIds.length === 0) {
    return [];
  }
  for (let id of appIds[0].appointments) {
    result.push(state.appointments[id]);
  }

  return result;
};

// returns an array of interviewers that matches the interviewers in the selected day
const getInterviewersForDay = (state, day) => {
  const result = [];
  const appIds = state.days.filter(eachDay => eachDay.name === day);

  if (appIds.length === 0) {
    return [];
  }
  for (let id of appIds[0].interviewers) {
    result.push(state.interviewers[id]);
  }

  return result;
};

const getInterview = (state, interview) => {
  if (interview === null) {
    return null;
  }

  return { student: interview.student, interviewer: state.interviewers[interview.interviewer]}
}



export { getAppointmentsForDay, getInterviewersForDay, getInterview };