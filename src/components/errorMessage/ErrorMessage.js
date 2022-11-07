import img from './1616600972_220734_gif-url.gif'
import {Image} from 'react-bootstrap'

const ErrorMessage = () => {
    return (
        <>
        <Image src={img}  fluid='true'  alt = 'Error'/>
        <h2 className='text-center'>Error!</h2>
        </>
    )
}

export default ErrorMessage;