import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {baseUrl} from "../../constants";
import {useHttp} from "../../http.hooks";


const notesAdapter = createEntityAdapter();
const initialState = notesAdapter.getInitialState({
    activeNote: null,
    notesLoadingStatus: 'idle',
    btnStatus: 'idle',
    collectTags: [],
    searchElements: []
});
export const fetchNotes = createAsyncThunk('notes/fetchNotes', () => {
        const {request} = useHttp();
        return request(`${baseUrl}/notices`);
    }
);
export const postNotes = createAsyncThunk('notes/postNotes', (body) => {
        const {request} = useHttp();
        return request(`${baseUrl}/notices`, 'POST', JSON.stringify(body));
    }
)
export const putNotes = createAsyncThunk('notes/putNotes', (body) => {
        const {request} = useHttp();
        return request(`${baseUrl}/notices/${body.id}`, 'PUT', JSON.stringify(body));
    }
)
export const deleteNote = createAsyncThunk('notes/deleteNote', (id) => {
    const {request} = useHttp();
    return request(`${baseUrl}/notices/${id}`, 'DELETE');
})

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setActiveNote: (state, element) => {
            state.activeNote = element.payload;
        },
        changeBtnStatus: (state, newStatus) => {
            state.btnStatus = newStatus.payload;
        },
        setCollectTags: ((state, tags) => {

            state.collectTags = tags.payload;
        }),
        setSearchElements: ((state, searchElements) => {
            state.searchElements = searchElements.payload;
        }),
        changeItem: (state, id, hoverIndex) => {
            state.notes[id] = state.notes[hoverIndex]

        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, state => {
                state.notesLoadingStatus = 'loading'

            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.notesLoadingStatus = 'idle'
                notesAdapter.setAll(state, action.payload)

            })
            .addCase(fetchNotes.rejected, state => {
                state.notesLoadingStatus = 'error'

            })
            .addCase(postNotes.fulfilled, (state, action) => {

                state.notesLoadingStatus = 'idle'
                notesAdapter.setOne(state, action.payload)

            })
            .addCase(putNotes.fulfilled, (state, action) => {
                state.notesLoadingStatus = 'idle'
                notesAdapter.upsertOne(state, action.payload)

            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                notesAdapter.removeOne(state, action.payload.id)
            })

            .addDefaultCase(() => {
            })

    }
})

const {actions, reducer} = notesSlice;

const {selectAll} = notesAdapter.getSelectors(state => state.notes);
export const notes = selectAll;

export const {changeBtnStatus, setActiveNote, setCollectTags, setSearchElements, changeItem} = actions;
export default reducer;