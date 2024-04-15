//manages the state of loading indicators
import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    }
});

export const { setUser } = userSlice.actions;