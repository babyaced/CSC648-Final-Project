//Import Libraries
import {useEffect} from 'react'
import { NavLink } from 'react-router-dom';

//Import UI Components
import SearchBar from '../Search/SearchBar'
import NavBarLeft from '../Nav/NavBarLeft'
import NavBarRight from '../Nav/NavBarRight'


import useWindowSize from '../Hooks/useWindowSize'

import styles from './NavBar.module.css'

function NavBar({appUser, updateLoginState}) {
    useEffect(() => {
    }, [appUser])


    if(useWindowSize().width < 600){
        console.log('width < 600');
    }
    
    return (
        <div className={styles["navbar"]}>
            <NavBarLeft appUser={appUser}/>
            <SearchBar/>
            <NavBarRight appUser={appUser} updateLoginState={updateLoginState}/>
        </div>
    )
}

export default NavBar;
