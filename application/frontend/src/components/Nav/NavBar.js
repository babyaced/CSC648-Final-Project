//Import Libraries
import {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom';

//Import UI Components
import SearchBar from '../Search/SearchBar'
import NavBarLeft from '../Nav/NavBarLeft'
import NavBarRight from '../Nav/NavBarRight'
import MobileSearchBar from '../Search/MobileSearchBar'

import styles from './NavBar.module.css'

function NavBar({appUser, updateLoginState}) {
    useEffect(() => {
    }, [appUser])

    const [mobileSearchBarDisplay, setMobileSearchBarDisplay] = useState(false)

    //for displaying the full width mobile search bar
    function displayMobileSearchBar(){
        setMobileSearchBarDisplay(true)
    }

    //for closing the full width mobile search bar
    function closeMobileSearchBar(){
        setMobileSearchBarDisplay(false)
    }

    return (
        <div className={styles["navbar"]}>
            {!mobileSearchBarDisplay && <NavBarLeft appUser={appUser}/>}
            {!mobileSearchBarDisplay && <SearchBar cssClass={"searchbar"}/>}
            {!mobileSearchBarDisplay && <NavBarRight appUser={appUser} updateLoginState={updateLoginState} displayMobileSearchBar={displayMobileSearchBar} closeMobileSearchBar={closeMobileSearchBar}/>}
            {mobileSearchBarDisplay && <SearchBar cssClass={"searchbar-mobile"}/>}
        </div>
    )
}

export default NavBar;
