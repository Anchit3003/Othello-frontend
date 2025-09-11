import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const setAuthToken = (token) =>{
    if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }else{
        delete axios.defaults.headers.common['Authorization'];
    }
}
export const signupUser = createAsyncThunk(
    'auth/SignupUser',
    async(userData, {rejectWithValue})=>{
        try{
            const response = await axios.post('http://localhost:5000/api/v1/auth/signup',userData,{
                  withCredentials: true
            });
            if (response.data.token) {
                setAuthToken(response.data.token);
            }
            return response.data
        }catch (error){
             console.log('signup error', error)

            if(error.response){
                const status = error.response.status
                const message = error.response.data?.message ||'Something went wrong. Please try again!!'
                return rejectWithValue({
                    status,
                    data: error.response.data,
                    message
                })
            }
            return rejectWithValue({
                status: 500,
                data: null,
                message: error.message || 'Network error occurred'
            })
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/LoginUser', async(credentials, {rejectWithValue})=>{
        try{
            const response = await axios.post('http://localhost:5000/api/v1/auth/signin', credentials,{
                withCredentials:true
            });
            if(response.data.token){
                setAuthToken(response.data.token)
            }
            return response.data
        }
        catch(error){
            if(error.response){
                
                const status = error.response.status
                const message =  error.response.data?.message || "invalid credentails"
                return rejectWithValue({
                    status,
                    message,
                    data:error.response.data
                })
            }
            return rejectWithValue({
                status: 500,
                data: null,
                message: error.message || 'Network error occurred'
            })

        }
    }
)


export const initializeAuth = createAsyncThunk(
    'auth/initializeAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                setAuthToken(token);
                return {
                    token,
                    user: JSON.parse(user)
                };
            }
            return rejectWithValue('No stored auth data');
        } catch (error) {
            return rejectWithValue('Failed to initialize auth');
        }
    }
);
const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        token:null,
        loading:false,
        error: null,
        isAuthenticated:false
    },
    reducers:{
        logout(state){
            state.user = null;
            state.token = null;
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setAuthToken(null)
        },
        clearError(state){
            state.error = null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(signupUser.pending,(state)=>{
            state.loading =true;
            state.error = null;
        })
        .addCase(signupUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem('token',action.payload.token)
            localStorage.setItem('user',JSON.stringify(action.payload.user ))

        })
        .addCase(signupUser.rejected, (state,action)=>{
             state.loading = false;
            state.error = action.payload?.message
            state.isAuthenticated = false 
        })

        .addCase(loginUser.pending,(state)=>{
            state.loading =true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem('token',action.payload.token)
            localStorage.setItem('user',JSON.stringify(action.payload.user ))

        })
         .addCase(loginUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload?.message;
            state.isAuthenticated = false;
        })
        .addCase(initializeAuth.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        })
        .addCase(initializeAuth.rejected, (state) => {
            state.isAuthenticated = false;
        })
    }
})

export const { logout,clearError } = authSlice.actions;
export default authSlice.reducer;