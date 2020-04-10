import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS, FETCH_SURVEY_TOTALS } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: res.data });
}

export const handleStripeToken = token => async dispatch => {
    const res = await axios.post('/api/stripe', token);
    dispatch({ type: FETCH_USER, payload: res.data })
}

export const submitSurvey = (values, history) => async dispatch => {
    const res = await axios.post('/api/surveys', values);
    history.push('/surveys');
    dispatch({ type: FETCH_USER, payload:res.data });
}

export const fetchSurveys = () => async dispatch => {
    const res = await axios.get('/api/surveys');
    dispatch({ type: FETCH_SURVEYS, payload: res.data });
}

export const fetchSurveyTotals = surveyId => async dispatch => {
    const res = await axios.get('/api/survey/totals/' + surveyId);
    dispatch({ type: FETCH_SURVEY_TOTALS, payload: res.data });
}