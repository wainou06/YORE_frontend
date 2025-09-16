import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surveyAPI from '@/api/surveyApi'

// thunk: 설문 리스트 불러오기
export const fetchSurveys = createAsyncThunk('survey/fetchSurveys', async (_, { rejectWithValue }) => {
   try {
      const res = await surveyAPI.getSurveys()

      return res.data.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
   }
})

const initialState = {
   surveys: [],
   loading: false,
   error: null,
}

const surveySlice = createSlice({
   name: 'survey',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchSurveys.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchSurveys.fulfilled, (state, action) => {
            state.loading = false
            state.surveys = action.payload
         })
         .addCase(fetchSurveys.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default surveySlice.reducer
