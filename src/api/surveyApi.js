import api from './axiosApi'

export const surveyAPI = {
   submitSurvey: (data) => api.post('/surveys', data),
   getSurveyResults: (id) => api.get(`/surveys/${id}`),
}
