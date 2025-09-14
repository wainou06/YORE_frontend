import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationAPI } from '../../api/notificationApi'

// 알림 목록 불러오기
export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async (_, thunkAPI) => {
   try {
      const res = await notificationAPI.list()
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
   }
})

// 알림 읽음 처리
export const markNotificationAsRead = createAsyncThunk('notification/markAsRead', async (id, thunkAPI) => {
   try {
      await notificationAPI.markAsRead(id)
      return id
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
   }
})

// 알림 삭제
export const deleteNotification = createAsyncThunk('notification/delete', async (id, thunkAPI) => {
   try {
      await notificationAPI.delete(id)
      return id
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
   }
})

// (선택) 알림 생성
export const createNotification = createAsyncThunk('notification/create', async (data, thunkAPI) => {
   try {
      const res = await notificationAPI.create(data)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
   }
})

const notificationSlice = createSlice({
   name: 'notification',
   initialState: {
      notifications: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 목록
         .addCase(fetchNotifications.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchNotifications.fulfilled, (state, action) => {
            state.loading = false
            state.notifications = action.payload
         })
         .addCase(fetchNotifications.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 읽음 처리
         .addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const id = action.payload
            const noti = state.notifications.find((n) => n.id === id)
            if (noti) noti.isRead = true
         })
         // 삭제
         .addCase(deleteNotification.fulfilled, (state, action) => {
            state.notifications = state.notifications.filter((n) => n.id !== action.payload)
         })
         // 생성
         .addCase(createNotification.fulfilled, (state, action) => {
            state.notifications.unshift(action.payload)
         })
   },
})

export default notificationSlice.reducer
