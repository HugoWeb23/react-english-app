import { useEffect, useState } from 'react';
import {useHistory, Redirect} from 'react-router-dom'

export const Play = ({location}) => {
    const history = useHistory();
   const [questions, setQuestions] = useState(null);
    useEffect(() => {
        setQuestions(location.state)
    }, [])
    
    console.log(questions)
    return <>
    {JSON.stringify(questions)}
    <button onClick={() => history.goBack()}>Retur arrière</button>
    </>
}