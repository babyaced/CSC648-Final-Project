import {useState} from "react";
import { useHistory } from "react-router";

import MapSearchPreview from '../../images/MapSearchPreview.png'

import styles from './SiteDemo2.module.css';


function SiteDemo2() {
  const [text, setText] = useState('Try the Tool');

  const history = useHistory();

  function searchLocalBusinesses(){
    navigator.geolocation.getCurrentPosition((position)=>{
      const location = {
        pathname:'/MapSearch',
        state: {lat:position.coords.latitude, lng:position.coords.longitude, searchTerm: "", searchCategoryParam: "Businesses"}
      }
      history.push(location);
    })
  }

  return (
    <div className={styles['site-demo2-container']}>
      <div className={styles['left-side']}>
        <img className={styles['left-side-map']} src={MapSearchPreview} />
      </div>
      <div className={styles['right-side']}>
        <div className={styles['right-side-text']}>
            Use our location search tool to find a pet-friendly small businesses near you 
            <button className={styles['site-demo2-button']} onClick={searchLocalBusinesses}>
            {text}
        </button>
        </div>
      </div>
    </div>
  );
}

export default SiteDemo2;