import { useEffect, useState } from 'react'

import axios from 'axios'

let localCache = [];

function useColorOptions() {
    const [colorOptions, setColorOptions] = useState([])
    const [status, setStatus] = useState('unloaded')

    useEffect(() => {
        if(!localCache.length){
            console.log('fetching Color options from db')
            requestColorOptions();
        }
        else{
            console.log('using Color options from cache')
            setColorOptions(localCache)
        }
    }, [])

    async function requestColorOptions(){
        setStatus("loading")

        axios.get('/api/colors')   //get pet Colors from database
        .then((response) => {
            console.log(response)
            localCache = response.data;
            setColorOptions(localCache);
            setStatus("loaded");
        })
        .catch((err) =>{
            console.log(err)
        })
    }
    return [colorOptions,status];
}

export default useColorOptions
