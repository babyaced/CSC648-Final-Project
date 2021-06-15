import { useEffect, useState } from 'react'

import axios from 'axios'

function BusinessCategoryOptions() {
    const [businessCategoryOptions, setBusinessCategoryOptions] = useState([])

    useEffect(() => {
        axios.get('/api/business-types')   //get pet types from database
        .then((response) => {
            console.log(response)
            setBusinessCategoryOptions(response.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }, [])
    
    return (
        businessCategoryOptions
    )
}

export default BusinessCategoryOptions
