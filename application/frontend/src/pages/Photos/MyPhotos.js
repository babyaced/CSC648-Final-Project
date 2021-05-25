import React, { useEffect, useState } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';

import styles from './Photo.module.css';

import PostModal from '../../components/Modals/PostModal';
import DeleteModal from '../../components/Modals/ConfirmPhotoDeletion';
import EditButton from '../../components/Buttons/EditButton';
import axios from 'axios'



function MyPhotos() {
    const {profileID} = useParams();  //get profileID from '/Photos/:profileID url

    const [name, setName] = useState('');
    const [photos, setPhotos] = useState([])
    
    useEffect(() => {
        setName();
        setPhotos();
    }, [])
    
    const [editing, setEditing] = useState(false);
    let location = useLocation();
    let history = useHistory();

    const [postModalDisplay, setPostModalDisplay] = useState(false);
    const [deleteModalDisplay, setDeleteModalDisplay] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});
    const [selectedPhotoId, setSelectedPhotoId] = useState({});

    function closePostModal(){
        setPostModalDisplay(false);
    }
    function presentPostModal(post){
        setSelectedPost(post);
        setPostModalDisplay(true);
    }

    function deletePhoto(id) {
        // display modal here
        let tempPhotos = photos.filter(photo => photo.post_id != id);
        setPhotos(tempPhotos);
    }

    let displayEditing = (
        <div className={styles.PhotosContainer} >
            {photos.map((photo, index) => (
                <div key={index} className={styles.PhotoDiv} onClick={() =>presentPostModal(photo)}>
                 {/* <div onClick={() => deletePhoto(photo.pet_id)}> */}
                    <img className={styles.Image} src={photo.pic} alt='No Image Found' />
                </div>
            ))}
        </div>
    )

    if (editing) {
        displayEditing  = (
            <div className={styles.PhotosContainer} >
                {photos.map((photo, index) => (
                    <div key={index} className={styles.EditingPhotoDiv} onClick={() => {
                        setSelectedPhotoId(photo.post_id);
                        setDeleteModalDisplay(true);
                        // deletePhoto(photo.post_id)
                    }} >
                        <div>
                            <img className={styles.Image} src={photo.pic} alt='No Image Found' />
                        </div>
                        <div className={styles.DeleteIcon} ></div>
                    </div>
                ))}
            </div>
        )     
    }         

    return (
        <>
            <div className={styles.Photos} >
                <div className={styles.NameDiv} >
                    <div className={styles.NameDivLeft} >
                        <h1>{name + '\'s Photos'}</h1>
                        {/* <button onClick={() => setEditing(!editing)} >{editing ? 'Finish Editing' : 'Edit'}</button> */}
                        <EditButton edit={!editing} clicked={() => setEditing(!editing)}>{editing ? 'Finish Editing' : 'Edit Photo'}</EditButton>
                    </div>
                    <div className={styles.NameDivRight} >
                        {/* <button>filter</button> */}
                        <p onClick={() => history.goBack()}>Back to Profile</p>
                    </div>
                </div>
                {/* <div className={styles.PhotosContainer} >
                    {photos.map((photo) => (
                        <div onClick={() =>presentPostModal()}>
                            <img key={photo.pet_id} className={styles.Image} src={photo.profile_pic} alt='No Image Found' />
                        </div>
                    ))}
                </div> */}
                {displayEditing}
            </div>
            <DeleteModal 
                display={deleteModalDisplay}  
                onConfirm={() => {
                    deletePhoto(selectedPhotoId);
                    setDeleteModalDisplay(false);
                }} 
                onClose={() => setDeleteModalDisplay(false)} 
            />
            <PostModal 
                display={postModalDisplay} 
                onClose={closePostModal}
                selectedPost={selectedPost}
            />
        </>
    )
}

export default MyPhotos;