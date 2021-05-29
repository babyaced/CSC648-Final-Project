import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';

import styles from './Photos.module.css';

import PostModal from '../../components/Modals/PostModal';
import EditButton from '../../components/Buttons/EditButton';

import axios from 'axios';

import Spinner from '../../components/UI/Spinner/Spinner';

import { RedirectPathContext } from '../../context/redirect-path';



function Photos() {
    const {profileID} = useParams();  //get profileID from '/Photos/:profileID url

    const [name, setName] = useState('');
    const [photos, setPhotos] = useState([])

    const redirectContext = useContext(RedirectPathContext);
    
    useEffect(() => {
        redirectContext.updateLoading(true);
        const getPhotos = axios.get('/api/photo-posts',{params: {profileID}})

        const getDisplayName = axios.get('/api/profile-display-name',{params: {profileID}})

        Promise.all([getPhotos, getDisplayName])
        .then((responses)=>{
            setPhotos(responses[0].data)
            setName(responses[1].data.display_name);
            redirectContext.updateLoading(false);
        })
        .catch((err) =>{
            redirectContext.updateLoading(false);
            console.log(err)
            //display error message to the user
        })

    }, [profileID])
    
    let location = useLocation();
    let history = useHistory();

    const [postModalDisplay, setPostModalDisplay] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});

    function closePostModal(){
        setPostModalDisplay(false);
    }
    function presentPostModal(post){
        setSelectedPost(post);
        setPostModalDisplay(true);
    }

    let displayEditing = (
        <div className={`${styles["photos-container"]} ${"wide-container"}`} >
            {photos.map((photoPost, index) => (
                <div key={photoPost.post_id} className={styles.PhotoDiv} onClick={() =>presentPostModal(photoPost)}>
                 {/* <div onClick={() => deletePhoto(photo.pet_id)}> */}
                    <img className={styles.Image} src={photoPost.link} alt='No Image Found' />
                </div>
            ))}
        </div>
    )

    let displayPhotos = (
        <div className={`${"wide-container"}`} >
        <div className={styles.NameDiv} >
            <div className={styles.NameDivLeft} >
                <h1>{name + '\'s Photos'}</h1>
            </div>
            <div className={styles.NameDivRight} >
                {/* <button>filter</button> */}
            </div>
        </div>
        {displayEditing}
        </div>
    )

    if (redirectContext.loading) {
        displayPhotos = <Spinner />
    }

    return (
        <>
            {displayPhotos}
            <PostModal display={postModalDisplay} onClose={closePostModal} selectedPost={selectedPost}/>
        </>
    )
}

export default Photos;