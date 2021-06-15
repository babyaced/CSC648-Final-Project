import { useEffect, useState } from 'react'

import axios from 'axios'

function SizeOptions() {

    const [sizeOptions, setSizeOptions] = useState([])

    useEffect(() => {
        axios.get('/api/sizes')   //get pet types from database
        .then((response) => {
            console.log(response)
            setSizeOptions(response.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [])
    
    return (
        sizeOptions
    )
}

export default SizeOptions
