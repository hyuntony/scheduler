import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: []
  });

  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    });
  }, []);

  const updateEmptyDays = (state) => {
    const currentDayObj = state.days.find(dayObj => dayObj.name === state.day);
    const currentDayIndex = state.days.findIndex(dayObj => dayObj.name === state.day);
    const listOfAppointmentIds = currentDayObj.appointments;
    const listofNullAppointments = listOfAppointmentIds.filter(id => !state.appointments[id].interview);
    const spots = listofNullAppointments.length;
    
    const day = { ...state.days[currentDayIndex], spots };
    const days = [...state.days];
    days[currentDayIndex] = day;
    return days;
  }

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState(prev => ({ ...prev, appointments }))
        setState(prev => ({ ...prev, days: updateEmptyDays(prev) }))
      })
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`api/appointments/${id}`)
      .then(() => {
        setState(prev => ({ ...prev, appointments }))
        setState(prev => ({ ...prev, days: updateEmptyDays(prev) }))
      })
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;