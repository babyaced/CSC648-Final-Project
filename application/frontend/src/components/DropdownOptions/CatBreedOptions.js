import { useEffect, useState } from 'react'

import axios from 'axios'

function CatBreedOptions() {
    const [catBreedOptions, setCatBreedOptions] = useState([])
    useEffect(() => {
        axios.get('/api/cat-breeds')   //get pet types from database
        .then((response) => {
            console.log(response)
            setCatBreedOptions(response.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [])
    return (
        catBreedOptions
    )
}

export default CatBreedOptions
