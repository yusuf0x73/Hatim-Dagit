






import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {db} from '../../backend';

const initialState = {
    visible: false,
    newYearlyKhatm: false,
    text: '',
}

const deleteHatim = createAsyncThunk("yesNoDialogAlert/deleteHatim" ,async ()=>{
    const result = await db.deleteHatim();
    if(result == -1){
        throw new Error("Hatim can't be deleted!")
    }
})

const deleteHatimV3 = createAsyncThunk("yesNoDialogAlert/deleteHatimV3" ,async ()=>{
    const result = await db.deleteHatimV3();
    if(result == -1){
        throw new Error("Hatim can't be deleted!")
    }
})

const newYearlyKhatmV3 = createAsyncThunk("yesNoDialogAlert/newYearlyKhatmV3" ,async ()=>{
    const {data, error} = await db.yeniYillikHatim({header:'', description:'',
                                         startingDate:'', howManyDays:'',
                                         totalKhatmsBeDistributed:'', donerli:'', makeNewHatim:'', mevcutHatim: true});
    if(data == undefined){
        throw new Error("Hatim can't be deleted!")
    }
})


const yesNoDialogAlertSlice = createSlice({
    name: 'yesNoDialogAlert',
    initialState,
    reducers:{
        toggleVisibility: state => {
            state.visible = !state.visible;
        },
        changeNewYearlyKhatm: (state, {payload}) => {
            state.newYearlyKhatm = payload;
        },
        changeText: (state, {payload}) => {
            state.text = payload;
        },
    },
    extraReducers:{
        [deleteHatim.fulfilled]: (state) => {
            state.visible = false;
        },
        [deleteHatim.rejected]: (state) => {
            state.visible = false;
        },
        [deleteHatimV3.fulfilled]: (state) => {
            state.visible = false;
        },
        [deleteHatimV3.rejected]: (state) => {
            state.visible = false;
        },
        [newYearlyKhatmV3.fulfilled]: (state) => {
            state.newYearlyKhatm = false;
            state.visible = false;
        },
        [newYearlyKhatmV3.rejected]: (state) => {
            state.newYearlyKhatm = false;
            state.visible = false;
        }
    }
})

const actions = yesNoDialogAlertSlice.actions;


export {actions, deleteHatim, deleteHatimV3, newYearlyKhatmV3}
export default yesNoDialogAlertSlice.reducer;