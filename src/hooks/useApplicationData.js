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
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  }, []);

  const bookInterview = function(id, interview) {
    const foundDay = state.days.find(element => element.name === state.day);
    const day = {...foundDay, spots: foundDay.spots - 1}
    const days = [...state.days];
    days.splice(day.id - 1, 1, day);

    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        setState(prev => ({...prev, appointments, days}));
      })
  };

  const cancelInterview = function(id) {
    const foundDay = state.days.find(element => element.name === state.day);
    const day = {...foundDay, spots: foundDay.spots + 1}
    const days = [...state.days];
    days.splice(day.id - 1, 1, day);

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
        setState(prev => ({...prev, appointments, days}));
      })
  };

  return {state, setDay, bookInterview, cancelInterview};
};

export default useApplicationData;