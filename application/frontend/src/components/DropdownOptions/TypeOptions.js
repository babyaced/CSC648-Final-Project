import { useEffect, useState } from 'react'

import axios from 'axios'

function TypeOptions() {

    const [typeOptions, setTypeOptions] = useState([])

    useEffect(() => {
        axios.get('/api/pet-types')   //get pet types from database
        .then((response) => {
            console.log(response)
            setTypeOptions(response.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [])
    
    return (
        typeOptions
    )
}

export default TypeOptions
