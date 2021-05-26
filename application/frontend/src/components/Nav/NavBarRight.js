//Import Libraries
import axios from "axios";
import {useRef, useEffect, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";

//Import Icons
import DropdownArrow from '../../images/Created Icons/Arrow.svg';
import Messages from '../../images/Created Icons/Messages.svg';
import Account from '../../images/Created Icons/Account.svg';
import Menu from '../../images/Created Icons/Menu.svg';


//Import UI Components
import useWindowSize from '../Hooks/useWindowSize'


//Import CSS
import styles from './NavBarRight.module.css'

//used to detect if there was a click outside the account menu to close it
let useClickOutside = (handler) =>{
  let domNode = useRef();

  useEffect(() =>{
    let maybeHandler = (event)=>{
      if(domNode){
        if(domNode.current && !domNode.current.contains(event.target)){
          handler();
        }
      }
    }
  
    document.addEventListener("mousedown", maybeHandler);
  
    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    }
  })

  return domNode
}

function NavBarRight({appUser, updateLoginState}) {
  const history = useHistory();

  const [accountMenuDisplay, setAccountMenuDisplay] = useState({display: 'none'});
  const windowSize = useWindowSize()

  console.log('windowSize: ',windowSize);

  function logoutHandler(){
    axios.post("/api/logout", {withCredentials: true}).then((response) =>{
      updateLoginState(response.data.loggedIn,response.data.user);
      history.push('/');
    })
    .catch((err) =>{
      console.log(err);
    });

  }

  function accountMenuToggle(){
    if(accountMenuDisplay =={display:'block'}){
      setAccountMenuDisplay({display: 'none'});
    }
    else{
      setAccountMenuDisplay({display: 'block'});
    }
    
  }

  let domNode = useClickOutside(()=>{
    setAccountMenuDisplay({display: 'none'})
  })

  let hamburgerMenu = false
  if(windowSize.width < 1170){
    hamburgerMenu = true
  }

  return (
        <>
          {!appUser && <button className={styles["login-link"]} onClick={()=>history.push("/login-page")}>Login</button>}
          {appUser &&
            <span className={styles['navbar-right']}>
              {windowSize.width <= 1170 && <img className={styles['menu-icon']} src={Menu} onClick={accountMenuToggle}/>}
              {windowSize.width <= 1470 && windowSize.width > 1170 &&
                <NavLink to="/Messages" className={styles["messages-menu-icon"]}>
                  <img src={Messages}/>
                </NavLink>
              }
              {windowSize.width > 1470 &&  <NavLink to="/Messages" className={styles["messages-menu"]}>Messages</NavLink>}
              <span ref={domNode} className="account-menu-dropdown">
                {windowSize.width <= 1470 && windowSize.width > 1170 && 
                  <img className={styles["account-menu-icon"]} src={Account} onClick={accountMenuToggle}/>
                }
                {windowSize.width > 1470 &&
                  <button className={styles["account-menu-dropdown-button"]} onClick={accountMenuToggle}>Account<img className={styles["account-menu-dropdown-arrow"]} src={DropdownArrow}/></button>
                }
                <ul  className={styles["account-menu-dropdown-content"]} style={ accountMenuDisplay}>
                  <li><NavLink className={styles["account-menu-dropdown-link"]} to={`/Profile/${appUser.profileID}`}>My Profile</NavLink></li>
                  <li><NavLink className={styles["account-menu-dropdown-link"]} to="/MyPets">My Pets</NavLink></li>
                  {windowSize.width <= 1170 && <li><NavLink className={styles["account-menu-dropdown-link"]} to="/Messages" >Messages</NavLink></li>}
                  <li><NavLink className={styles["account-menu-dropdown-link"]} to="/" onClick={logoutHandler}>Logout</NavLink></li>
                </ul>
              </span>
            </span>
          }
        </>
  );
}


export default NavBarRight;