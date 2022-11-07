import {lazy, Suspense, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import {fetchDirectories} from "../directoryList/directoriesSlice";
import {fetchNotes} from "../noteList/notesSlice";

import Header from "../header/Header";
import Spinner from "../spinner/Spinner";

const MainPage = lazy(() => import("../pages/mainPage/MainPage"));
const SearchPage = lazy(() => import("../pages/searchPage/SearchPage"));
const Page404 = lazy(() => import("../pages/404/404"))

function App() {

    const [loaded, setLoaded] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!loaded) {
            Promise.all([dispatch(fetchDirectories()), dispatch(fetchNotes())]).then((res) => {
                setLoaded(true)
            })
        }
    }, [])

    return (

        <Router>
            <Header/>
            <main>
                <Suspense fallback={<Spinner/>}>
                    {loaded
                        ? <Routes>
                            <Route path='/' element={<MainPage/>}/>
                            <Route path='/searchResult/:searchPhrase' element={<SearchPage/>}/>
                            <Route path='/:directoryId' element={<MainPage/>}/>
                            <Route path='/:directoryId/:notesId' element={<MainPage/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>
                        : <Spinner/>
                    }
                </Suspense>
            </main>
        </Router>
    )
}

export default App;
