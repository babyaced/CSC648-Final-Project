import axios from "axios";
import { useEffect, useState } from "react";
import {useParams, useHistory, Link} from "react-router-dom";
import Tab from "../../components/UI/Tab/Tab.js"

import Spinner from '../../components/UI/Spinner/Spinner';

import styles from "./Followers.module.css";

// Import Components Here
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

  const FollowerCard = ({ title, src, key }) => {
    return (
      <div className={styles["follower-card"]}>
        <img src={src} className={styles["follower-card-pic"]} />
        <div className={styles["follower-card-name"]}>{title}</div>
      </div>
    );
  };

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


  return (
    <div>
      {loading ? <Spinner /> : 
      <div className={`${styles["followers-container"]} ${"container"}`}>
        <div className={styles["tabContainer"]}>
          <div className={styles.Tabs}>
            <div style={{ display: "flex", width: "100%" }}>{tabs}</div>
            <div style={{ cursor: "pointer" }}>
              {/* <button>filter</button> */}
              <p
                className={styles["tab-container-link"]}
                onClick={() => history.goBack()}
              >
                Back to Profile
              </p>
            </div>
          </div>
          {selectedTab === 0 && (
            <div>
              <div className={styles["followers-listing"]}>
                {" "}
                {followers.map((item) => (
                  <Link
                    style={{ textDecoration: "none" }}
                    key={item.profile_id}
                    to={"/Profile/" + item.profile_id}
                  >
                    <div
                      style={{
                        padding: " 10px 0px",
                      }}
                    >
                      <FollowerCard
                        title={item.display_name}
                        src={item.profile_pic_link}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 1 && (
            <div>
              <div className={styles["followers-listing"]}>
                {" "}
                {following.map((item) => (
                  <Link
                    style={{ textDecoration: "none" }}
                    key={item.profile_id}
                    to={"/Profile/" + item.profile_id}
                  >
                    <div
                      style={{
                        padding: " 10px 0px",
                      }}
                    >
                      <FollowerCard
                        title={item.display_name}
                        src={item.profile_pic_link}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>}
    </div>
  );
}

export default Followers;
