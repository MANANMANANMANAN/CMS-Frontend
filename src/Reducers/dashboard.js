import { createReducer } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated: false
};
export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('LoadUserRequest', (state) => {
            state.loading = true;
        })
        .addCase('LoadUserSuccess', (state, action) => {
            state.loading = false;
            state.prof = action.payload;
            state.isAuthenticated = true;
        })
        .addCase('LoadUserFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase('LoginRequest', (state) => {
            state.loading = true;
        })
        .addCase('LoginSuccess', (state, action) => {
            state.loading = false;
            state.prof = action.payload;
            state.isAuthenticated = true;
        })
        .addCase('LoginFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase('LogoutRequest', (state) => {
            state.loading = true;
        })
        .addCase('LogoutSuccess', (state, action) => {
            state.loading = false;
            state.prof = action.payload;
            state.isAuthenticated = false;
        })
        .addCase('LogoutFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = true;
        })


});
export const courseReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('preRequest', (state) => {
            state.loading = true;
        })
        .addCase('preSuccess', (state, action) => {
            state.loading = false;
            state.courses = action.payload.courses;
        })
        .addCase('preFailure', (state, action) => {
            state.loading = false;
            state.error = action.payload
        })
        .addCase('reqRequest', (state) => {
            state.loading_b = true;
        })
        .addCase('reqSuccess', (state, action) => {
            state.loading_b = false;
            state.requests = action.payload.courses_requested;
        })
        .addCase('reqFailure', (state, action) => {
            state.loading_b = false;
            state.error_b = action.payload
        })
        .addCase('reqCRequest', (state) => {
            state.loading_c = true;
        })
        .addCase('reqCSuccess', (state, action) => {
            state.loading_c = false;
            // state.requests = action.payload.courses_requested;
        })
        .addCase('reqCFailure', (state, action) => {
            state.loading_c = false;
            state.error_c = action.payload
        })
        .addCase('reqDRequest', (state) => {
            state.loading_d = true;
        })
        .addCase('reqDSuccess', (state, action) => {
            state.loading_d = false;
            state.preregdata = action.payload.students_preregistered;
        })
        .addCase('reqDFailure', (state, action) => {
            state.loading_d = false;
            state.error_d = action.payload
        })
        .addCase('studRequest', (state) => {
            state.loading_stud = true;
        })
        .addCase('studSuccess', (state, action) => {
            state.loading_stud = false;
            state.preregdata = null;
        })
        .addCase('studFailure', (state, action) => {
            state.loading_stud = false;
            state.error_stud = action.payload
        })
})