/*
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, {defaults} from "axios";

const register = createAsyncThunk(
  'user/registerUser',
  async ({name, email, password}) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const {data} = await axios.post(
        '/api/users',
        {name, email, password},
        config)

      return data
    } catch (e) {
      console.log(e)
    }
  }
)


const initialState = {
  user: {}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser(state, action) {
      console.log(state)
      console.log(action)
    }
  },
  extraReducers: {

  }
})

export const actions = userSlice
export default userSlice.reducer

/!*(builder) => {
    builder
      .addCase(register.pending, (state, action) => {
        state.user = {loading: true}
    })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.user = {error: action.error}
      })
  }*!/*/
