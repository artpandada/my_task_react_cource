import {NavLink} from "react-router-dom";
import {Navbar, Container, Form} from "react-bootstrap";

import SearchPanel from "../searchPanel/SearchPanel";

import logo from './cat-paw-black-white.png'


const Header = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to='.'>
                    <img src={logo}
                         width="30"
                         height="30"
                         className="d-inline-block align-top"
                         alt="logo"
                    />{'  '}
                    CatNote
                </Navbar.Brand>
                <Form className="d-flex">
                    <SearchPanel/>
                </Form>
            </Container>
        </Navbar>

    )
}

export default Header;