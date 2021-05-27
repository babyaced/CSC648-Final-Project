import axios from "axios";
import { useEffect, useState } from "react";
import {useParams, useHistory, Link} from "react-router-dom";


import Spinner from '../../components/UI/Spinner/Spinner';

import styles from "./Followers.module.css";

//Import Components Here
import FollowerCard from "./FollowerCard.js"
import Tab from "../../components/UI/Tab/Tab.js"
import { es } from "date-fns/locale";

function Followers() {

  const {profileID} = useParams();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFollowers = axios.get('/api/followers',{params: {profileID}}) // call to get followers
 
  const getFollowing = axios.get('/api/following',{params: {profileID}}) //call to get followed Users (following)

  // const redirectContext = useContext(RedirectPathContext);

  useEffect(() =>{
    setLoading(true);
    Promise.all([getFollowers, getFollowing])
    .then((responses)=>{
      setFollowers(responses[0].data);
      setFollowing(responses[1].data);
      setLoading(false);
    })
    .catch((err) =>{
      setLoading(false);
    })
  },[profileID])

  let history = useHistory();

  const [selectedTab, setSelectedTab] = useState(0);

  const onTabClicked = (value) => {
    setSelectedTab(value);
  };

  let tabs = ["Followers", "Following"].map((tab, index) => (
    <Tab
      key={tab}
      id={index}
      section={tab}
      selected={selectedTab}
      length={index === 0 ? followers.length : following.length}
      clicked={onTabClicked}
    />));

  let fList = []

  //Set List to display based on selectedTab
  if(selectedTab === 0){
    fList = followers
  }
  else if(selectedTab === 1){
    fList = following
  }

  return (
    <div>
      {loading ? <Spinner /> : 
      <div className={`${styles["followers-container"]} ${"container"}`}>
        <div className={styles["tabContainer"]}>
          <div className={styles.Tabs}>
            {tabs}
          </div>
            <div>
              <div className={styles["followers-listing"]}>
                {" "}
                {fList.map((item) => (
                  <Link style={{ textDecoration: "none" }} key={item.profile_id} to={"/Profile/" + item.profile_id}>
                    <div style={{padding: " 10px 0px"}}>
                      <FollowerCard key={item.profile_id} title={item.display_name} src={item.profile_pic_link}/>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>}
    </div>
  );
}

export default Followers;
