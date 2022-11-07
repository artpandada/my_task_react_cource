import { configureStore } from '@reduxjs/toolkit';
import directories from './components/directoryList/directoriesSlice'
import notes from "./components/noteList/notesSlice";

const store = configureStore({
    reducer: {directories, notes}
})

export default store;