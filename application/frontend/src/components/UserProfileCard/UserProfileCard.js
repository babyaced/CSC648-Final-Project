import { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Tab from "./Tab/Tab";
import styles from "./UserProfileCard.module.css";

/****************************************************************************
 * File name: UserProfileCard.js
 * Description: The code below will utilize css modules and hooks in order
 * to format the Followers page for the website.
 * Expected Output: The page will have two tabs (e.g. following, followers)
 * which will show a column of users that correspond to  their respective
 * tab. It will display a back to profile link at a screen size that is
 * greater than 415px. Otherwise it will be hidden for smaller mobile phones.
 ***************************************************************************/
function UserProfileCard({ followersList, followingList }) {
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
      length={index === 0 ? followersList.length : followingList.length}
      clicked={onTabClicked}
    />
  ));

  return (
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
              {followersList.map((item) => (
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
              {followingList.map((item) => (
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
    </div>
  );
}

export default UserProfileCard;
