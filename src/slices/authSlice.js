import {createSlice} from "@reduxjs/toolkit"

// this is our one reducer now import this in reducer folder 
const initialState = {
    signupData : null,
    loading : false,
    // json.parse, string into an object.
    token:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") ) : null,
};

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData(state , value){
            state.signupData = value.payload
        },
        setLoading(state , value){
            state.loading = value.payload
        },
        setToken(state , action) {
            state.token = action.payload;
        },
    },
});

export const {setToken,setSignupData,setLoading} = authSlice.actions;
export default authSlice.reducer;