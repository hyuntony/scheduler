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



export { getAppointmentsForDay };