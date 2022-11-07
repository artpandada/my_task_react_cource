import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit';


import {baseUrl} from "../../constants";
import {useHttp} from "../../http.hooks";
import {changeArr} from "../../helper";


const directoriesAdapter = createEntityAdapter();
const initialState = directoriesAdapter.getInitialState({
    activeDirectory: null,
    directoriesLoadingStatus: 'idle',
    btnStatus: 'idle'
});


export const fetchDirectories = createAsyncThunk('directories/fetchDirectories', () => {
        const {request} = useHttp();
        return request(`${baseUrl}/directories`);
    }
);
export const postDirectory = createAsyncThunk('directories/postDirectory', (body) => {
        const {request} = useHttp();
        return request(`${baseUrl}/directories`, 'POST', JSON.stringify(body));
    }
)
export const putDirectory = createAsyncThunk('directories/putDirectory', (body) => {
        const {request} = useHttp();
        return request(`${baseUrl}/directories/${body.id}`, 'PUT', JSON.stringify(body));
    }
)
export const deleteDirectory = createAsyncThunk('directories/deleteDirectory', (id) => {
        const {request} = useHttp();
        return request(`${baseUrl}/directories/${id}`, 'DELETE');
    }
)


export const directoriesSlice = createSlice({
    name: 'directories',
    initialState,
    reducers: {
        setActiveDirectory: (state, element) => {
            state.activeDirectory = element.payload;
        },
        changeBtnStatus: (state, newStatus) => {
            state.btnStatus = newStatus.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDirectories.pending, state => {
                state.directoriesLoadingStatus = 'loading'
            })
            .addCase(fetchDirectories.fulfilled, (state, action) => {
                const changeAction = changeArr(action.payload)
                state.directoriesLoadingStatus = 'idle'
                directoriesAdapter.setAll(state, changeAction)

            })
            .addCase(fetchDirectories.rejected, state => {
                state.directoriesLoadingStatus = 'error'
            })
            .addDefaultCase(() => {
            })

    }
})

const {actions, reducer} = directoriesSlice;


const {selectAll} = directoriesAdapter.getSelectors(state => state.directories);
export const directories = selectAll;


export const {setActiveDirectory, changeBtnStatus} = actions;
export default reducer;
