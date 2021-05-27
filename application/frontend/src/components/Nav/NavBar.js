//Import Libraries
import {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom';

//Import UI Components
import SearchBar from '../Search/SearchBar'
import NavBarLeft from '../Nav/NavBarLeft'
import NavBarRight from '../Nav/NavBarRight'
import MobileSearchBar from '../Search/MobileSearchBar'

import styles from './NavBar.module.css'

//Import Custom Hooks
import useWindowSize from '../Hooks/useWindowSize'

function NavBar({appUser, updateLoginState}) {
    useEffect(() => {
    }, [appUser])

    const [mobileSearchBarDisplay, setMobileSearchBarDisplay] = useState(false)

    const windowSize = useWindowSize()

    //for displaying the full width mobile search bar
    function displayMobileSearchBar(){
        setMobileSearchBarDisplay(true)
    }

    //for closing the full width mobile search bar
    function closeMobileSearchBar(){
        setMobileSearchBarDisplay(false)
    }

    // //automatically close mobile search bar if width exceeds mobile device width
    // if(windowSize.width > 450){
    //     closeMobileSearchBar()
    // }

    return (
        <div className={styles["navbar"]}>
            {!mobileSearchBarDisplay && <NavBarLeft appUser={appUser}/>}
            {!mobileSearchBarDisplay && <SearchBar cssClass={"searchbar"}/>}
            {!mobileSearchBarDisplay && <NavBarRight appUser={appUser} updateLoginState={updateLoginState} displayMobileSearchBar={displayMobileSearchBar} closeMobileSearchBar={closeMobileSearchBar}/>}
            {mobileSearchBarDisplay && <SearchBar cssClass={"searchbar-mobile"} closeMobileSearchBar={closeMobileSearchBar}/>}
        </div>
    )
}

export default NavBar;
