import { FETCH_SURVEY_TOTALS } from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_SURVEY_TOTALS:
            const { surveyId } = action.payload;
            return {
                ...state,
                [surveyId]: {
                    ...state[surveyId],
                    isFetched: null,
                    data: action.payload
                }
            };
        default:
            return state;
    }
}