import { useEffect, useState } from 'react'

import axios from 'axios'

function ColorOptions() {
    const [colorOptions, setColorOptions] = useState([])
    useEffect(() => {
        axios.get('/api/colors')   //get pet types from database
        .then((response) => {
            console.log(response)
            setColorOptions(response.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [])
    return (
        colorOptions
    )
}

export default ColorOptions
