import {useSelector} from "react-redux";
import {useState} from "react";
import {useNavigate} from 'react-router-dom';

import {notes} from "../noteList/notesSlice";

import {Form} from "react-bootstrap";


const SearchPanel = () => {

    const allNotes = useSelector(notes);

    const [value, setValue] = useState('')

    const optionsName = allNotes
        .map(el => el.title)
        .filter((el, i, arr) => arr.indexOf(el) === i)
    const optionsTags = allNotes
        .map(el => el.tags)
        .toString().split(',')
        .filter((el, i, arr) => arr.indexOf(el) === i)

    const items = [...optionsName, ...optionsTags];

    const navigate = useNavigate();
    const getSearchElement = element => {
        navigate(`/searchResult/${element}`)
    }


    return (
        <>
            <Form.Control
                list="datalistOptions" id="dataList"
                autoComplete="off"
                type="search"
                value={value}
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        getSearchElement(event.target.value)
                    }
                }}


            />
            <datalist id="datalistOptions">
                {items.map((item, index) => (
                    <option
                        value={item}
                        key={index}
                    />
                ))}
            </datalist>
        </>
    )
}

export default SearchPanel;