import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {notes, setCollectTags} from "../../../noteList/notesSlice";

import {CloseButton, Form, Badge, Container} from "react-bootstrap";

const Tags = ({edit, activeNote}) => {

    let tags = useSelector(state => state.notes.collectTags);

    const [error, setError] = useState("");
    const [value, setValue] = useState('')

    const optionsTags = useSelector(notes)
        .map(el => el.tags).toString()
        .split(',')
        .filter((el, i, arr) => arr.indexOf(el) === i);

    const dispatch = useDispatch();

    useEffect(() => {
        if (edit) {
            dispatch(setCollectTags(activeNote.tags));
        }
    }, [])


    const handleTags = event => {
        if (event.key === "Enter" && value !== "") {
            event.preventDefault()
            dispatch(setCollectTags([...tags, value]))
            setValue('')

        } else if (tags.length < 1 && event.key === "Backspace") {
            setError("Since there is no tags you can't able to delete any tags");
        } else if (value === "" && event.key === "Enter") {
            event.preventDefault()
            setError("The tag should be one character long!");
        }
    };

    const removeTags = index => dispatch(setCollectTags([...tags.filter(tag => tags.indexOf(tag) !== index)]));

    return (
        <>
            <div>
                {tags.map((tag, index) => (
                    <Badge variant='outline-dark' key={index} bg='dark' className='me-2 mb-2'>
                        {tag}
                        <CloseButton variant='white' onClick={() => removeTags(index)}/>
                    </Badge>
                ))}

                <Form.Control className='mb-4'
                              autoComplete="off"
                              list="tagsOptions" id="DataList"
                              placeholder="Write and press enter..."
                              value={value}
                              onKeyDown={event => {
                                  handleTags(event)
                              }}
                              onChange={(e) => {
                                  setValue(e.target.value)
                                  setError("")
                              }}
                />
            </div>
            <datalist id="tagsOptions">
                {optionsTags.map((item, index) => (<option key={index} value={item}/>))}
            </datalist>

            <Container className='mb-2 text-danger'>
                {error}
            </Container>

        </>
    );
};
export default Tags;