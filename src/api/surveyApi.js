import api from './axiosApi'

export const surveyAPI = {
   getSurveys: () => api.get('/surveys'),
}

export default surveyAPI
