import { useEffect, useState } from 'react'

import axios from 'axios'

function DogBreedOptions() {
    const [dogBreedOptions, setDogBreedOptions] = useState([])
    useEffect(() => {
        axios.get('/api/Dog-breeds')   //get pet types from database
        .then((response) => {
            console.log(response)
            setDogBreedOptions(response.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [])
    return (
        dogBreedOptions
    )
}

export default DogBreedOptions
