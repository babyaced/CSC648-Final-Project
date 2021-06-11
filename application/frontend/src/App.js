import {BrowserRouter as Router, Switch, Route, Redirect, useParams} from 'react-router-dom'

import {useEffect, useState} from 'react';
import Home from './pages/Home/Home'
import Edgar from './pages/AboutMe/Edgar'
import Cameron from './pages/AboutMe/Cameron'
import Wameedh from './pages/AboutMe/Wameedh'
import Daniel from './pages/AboutMe/Daniel'
import Em from './pages/AboutMe/Em'
import Sabrina from './pages/AboutMe/Sabrina'
import Wenjie from './pages/AboutMe/Wenjie'
import NavBar from './components/Nav/NavBar'

import AccountTypePage from './pages/AccountType/AccountType.js'
import LoginPage from './pages/Login/LoginPage.js'
import SignUpPage from './pages/Sign Up/SignUpPage.js'
import ShelterSignUpPage from './pages/Sign Up/ShelterSignUp.js'
import ShelterSignUpPage2 from './pages/Sign Up/ShelterSignUpPage2.js'
import BusinessSignUpPage from './pages/Sign Up/BusinessSignUp.js'
import BusinessSignUpPage2 from './pages/Sign Up/BusinessSignUpPage2.js'
import ProfilePage from './pages/Profile/Profile';
import Messages from './pages/Messages/Messages'
import MyPets from './pages/Pets/MyPets'
import Pets from './pages/Pets/Pets'
import ResetPage from './pages/Reset/ResetPage'

import AdminFeed from './pages/Feed/AdminFeed.js';
import Feed from './pages/Feed/Feed.js'
import Photos from './pages/Photos/Photos';
import Followers from './pages/Followers/Followers';

import SignUpSuccess from './pages/Sign Up/SignUpSuccess'


import MapSearch from './pages/MapSearch/MapSearch.js'

import axios from 'axios';
import Spinner from './components/UI/Spinner/Spinner';

const App = () => {

  const [appUser,setAppUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/login",{withCredentials: true}).then((response) =>{
      setAppUser(response.data);
      setLoggedIn(true)
      setLoading(false)
    })
    .catch((err) =>{
      setLoading(false)
    })
  },[])


  function updateLoginState(loggedIn, user){
    setAppUser(user);
  }

  function PrivateRoute({children, ...rest}){
    return (
    <Route {...rest} render={()=>{
      return appUser ? children : <Redirect to={'/login-page'}/>
    }}/>)
  }

  function AdminRoute({children, ...rest}){
    return (
    <Route {...rest} render={()=>{
      return appUser ? children :  <Redirect to={'/login-page'}/>
    }}/>)
  }


  return (
    <>
    {loading && <Spinner/>}
    {!loading && <Router>
      <NavBar
            appUser={appUser}
            updateLoginState={updateLoginState} 
      />
       <Switch>
        <Route exact path="/" >
          <Home appUser={appUser} />
        </Route>
        <Route exact path="/login-page" >
          <LoginPage appUser={appUser} updateLoginState={updateLoginState}/>
        </Route>
        <Route path="/account-type" exact component={AccountTypePage}/>
        <Route path="/signup-page/personal" exact>
          <SignUpPage type="personal"/>
        </Route>
        <Route path="/signup-page/business" exact>
          <SignUpPage type="business"/>
        </Route>
        <Route path="/signup-page/shelter" exact>
          <SignUpPage type="shelter"/>
        </Route>
        <Route path="/shelter-signup" exact component={ShelterSignUpPage}/>
        <Route path="/shelter-signup2" exact component={ShelterSignUpPage2}/>
        <Route path="/business-signup" exact component={BusinessSignUpPage}/>
        <Route path="/business-signup2" exact component={BusinessSignUpPage2}/>
        <Route path="/Edgar" component={Edgar}/>
        <Route path="/Daniel" component={Daniel}/>
        <Route path="/Em" component={Em}/>
        <Route path="/Sabrina" component={Sabrina}/>
        <Route path="/Wenjie" component={Wenjie}/>
        <Route path="/Cameron" component={Cameron}/>
        <Route path="/Wameedh" component={Wameedh}/>

        {/* Public Pages */}
        <Route path="/MapSearch" component={MapSearch}/>
        <Route exact path="/Profile/:profileID">
          <ProfilePage appUser={appUser}/>
        </Route>
        <Route path="/Photos/:profileID" component={Photos}/>
        <Route path="/Followers/:profileID" component={Followers}/>

        {/* User Pages */}
        <PrivateRoute path="/Feed">
          <Feed appUser={appUser}/>
        </PrivateRoute>

        {/* <Route path="/MyPhotos" component={MyPhotos}/> */}
        <PrivateRoute path="/Messages">
          <Messages/>
        </PrivateRoute>
        <PrivateRoute path="/MyPets">
          <MyPets/>
        </PrivateRoute>
        <PrivateRoute path="/Pets/:profileID">
          <Pets/>
        </PrivateRoute> 
        {/* <Route path="/ExploreUsers" component={ExploreUsers}/> */}

        <Route path="/SignUpSuccess" component={SignUpSuccess}/>
        <Route path="/business/Register" component={ResetPage}/>


        <Route path="/reset/:token" component={ResetPage}/>

        <Route path="/AdminFeed">
          <AdminFeed appUser={appUser}/>
        </Route>

        {/* <Redirect to="/" /> */}
      </Switch>
    </Router>
  }
  </>
  );
}

export default App;
