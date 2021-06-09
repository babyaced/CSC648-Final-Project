import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import styles from './ImageContainer.module.css';

import PostModal from '../../Modals/PostModal'

function ImageContainer({previews, profile, title, selfView}) {
    console.log('previews',previews);
    const [postModalDisplay, setPostModalDisplay] = useState(false);
    const [imageStack, setImageStack] = useState();
    const [selectedPost,setSelectedPost] = useState({});

    let history = useHistory();

    function closePostModal(){
        setPostModalDisplay(false);
    }

    function presentPostModal(index){
        setSelectedPost(previews[index])
        setPostModalDisplay(true);
    }

    let limitedPreviews = previews
    if(previews.length > 5){
        limitedPreviews = previews.slice(0,5);
    }
    
    
    let seeAll = null;
    let placeholder = null;
    if (limitedPreviews.length === 0)
        seeAll = null;
    else if (title === 'Photos' || title === 'My Photos') {
        placeholder = <div className={styles['placeholder']} ><h3>No Photos to show</h3></div>
        selfView ?  //this won't work because the user will still able to go to photos/:profileId by directUrl, it will be better to check ownership on the page itself
        seeAll = <Link className={styles['see-all-link']} to={"/Photos/" + profile.profile_id}>See All</Link>
        :
        seeAll = <Link className={styles['see-all-link']} to={"/Photos/" + profile.profile_id}>See All</Link>
    }
    else if (title === 'My Pets') {
        placeholder = <div className={styles.EmptyDiv} ><h3>No Pets to show</h3></div>
        seeAll = <Link className={styles['see-all-link']} to={"/Pets/" + profile.profile_id}>See All</Link>
    }
    else {
        placeholder =<div className={styles['placeholder']} ><h3>No Siblings to show</h3></div>
        seeAll = <Link className={styles['see-all-link']} to={"/Pets/" + profile.profile_id}>See All</Link>
    }

    return (
        <>
                <h2>{title}</h2>
                <div className={styles['preview-stack']} >
                    {limitedPreviews.length == 0 && placeholder}
                    {limitedPreviews.length > 0 && limitedPreviews.map((preview, index) => {
                            let displayPostModal = (
                                <div onClick={() => presentPostModal(index)} key={preview.photo_id}>
                                        <img src={preview.link} alt="No Image Found" />
                                </div>
                            )
                            if (title === 'My Siblings' || title === 'My Pets' || title === 'Pets')
                                displayPostModal = (
                                    <div onClick={ () => history.push("/Profile/" + preview.profile_id)} key={preview.profile_id}>
                                            <img src={preview.profile_pic_link} alt="No Image Found"/>
                                            <div className={styles.ImageStackText} >{previews[index].display_name}</div>
                                    </div>
                                )
                            return displayPostModal
                    })}
                    {seeAll}
                </div>
        {/* Modals */}
        <PostModal display={postModalDisplay} onClose={closePostModal} selectedPost={selectedPost}/>
        </>
    );
}

export default ImageContainer;