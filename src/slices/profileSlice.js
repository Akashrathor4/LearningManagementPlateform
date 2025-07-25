import {createSlice} from "@reduxjs/toolkit"

// this is our one reducer later import this reducer  in reducer folder 
const initialState = {
      //agar direct null kar donge to reload krne par undefined aa jayega  data mean usre null ho jayega is
      //jaruri hai ki localstorage me save kr de user ko login ke time ko then usko fetch kre
      //user:null; direct null nhi karenge otherwise state persist nhi hogi localstorage se data lane ki bhut import hai agar persits krna hai login state ko tagda phase the yha
       user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
       loading: false,

};

const profileSlice = createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state , action) {
            state.user = action.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },

    },
});

export const {setUser,setLoading} = profileSlice.actions;
export default profileSlice.reducer;