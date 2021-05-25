import { useState, useEffect, useCallback, useContext, useRef } from 'react'
import {Link, useHistory } from "react-router-dom";
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import Select from 'react-select';  

import styles from './Feed.module.css'

import PostModal from '../../components/Modals/PostModal'
import Spinner from '../../components/UI/Spinner/Spinner';
import ButtonLoader from '../../components/UI/Spinner/ButtonLoader';

import useFeed from './useFeed'

import { RedirectPathContext } from '../../context/redirect-path';

import LikeIcon from '../../images/Third Party Icons/icons8-thumbs-up-48.png'
import FlagIcon from '../../images/Third Party Icons/icons8-empty-flag.png'


// import ClipLoader from "react-spinners/ClipLoader";

//make this into environment variable before deploying!
const apiGatewayURL = 'https://5gdyytvwb5.execute-api.us-west-2.amazonaws.com/default/getPresignedURL';

function Feed({appUser}) {
    const history = useHistory()
    if(appUser.role == 4){
        history.push('/AdminFeed')
    }

    const [postModalDisplay, setPostModalDisplay] = useState(false);

    //creating a post display
    const [createPostDisplayName, setCreatePostDisplayName] = useState('');
    const [createPostProfilePic, setCreatePostProfilePic] = useState('');
    const [createdPostBody, setCreatedPostBody] = useState();

    //selectedPost to pass to post modal
    const [selectedPost, setSelectedPost] = useState({});

    //storing the pets available to tag in the dropdown menu
    const [taggablePets, setTaggablePets] = useState([]);

    //storing the pets that are tagged in each post to send to db
    const [taggedPets, setTaggedPets] = useState([]);

    //image upload array
    const [myFiles, setMyFiles] = useState([])

    //loading UI
    const [loading, setLoading] = useState(false);

    const redirectContext = useContext(RedirectPathContext);


    const [offset, setOffset] = useState(0)
    const {feedPosts, hasMore, postsLoading,error} = useFeed(offset, false); //custom hook for loading posts
    const [posts, setPosts] = useState([...feedPosts])

    const observer = useRef()

    const lastPostElementRef = useCallback((node) =>{
        if(postsLoading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries =>{
            if(entries[0].isIntersecting ){
                setOffset(prevOffset => prevOffset + 10)
            }
        })
        if(node) observer.current.observe(node)
    }, [postsLoading, hasMore])

    function customTheme(theme) { //move this a separate file and import maybe?
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primary25: '#B3B3B3',
                primary: '#1CB48F',
            }
        }
    }

    const customStyles = {
        control: (base, state) => ({
          ...base,
          height: '54.5px',
          'min-height': '54.5px',
          'border-radius': '7.5px',
        }),
    };


    //runs on refresh
    useEffect(() => { //get profile pic and name of user  //
        redirectContext.updateLoading(true);

        const getFeedUser = axios.get('/api/feed-user')
        const getFeedUserPets =  axios.get('/api/current-user-pets')

        Promise.all([getFeedUser,getFeedUserPets])
        .then((responses) =>{
            setCreatePostDisplayName(responses[0].data.display_name);
            setCreatePostProfilePic(responses[0].data.profile_pic_link);
    
            let taggablePetOptions = [];
            //construct compatible list of options for react-select from backend response
            for(let i = 0; i < responses[1].data.length; i++){
                taggablePetOptions.push({value: responses[1].data[i].pet_id, label: responses[1].data[i].display_name});
            }
            setTaggablePets(taggablePetOptions);
            redirectContext.updateLoading(false);
        })
        .catch(err =>{
            redirectContext.updateLoading(false);
            console.log(err);
            //display error message to the user
        })
    }, [])

    // //runs whenever the user creates a post
    // useEffect(()=>{
    //     axios.get('/api/posts')
    //     .then(response =>{
    //         setFeedPosts(response.data);
    //     })
    // },[])





    

    useEffect(() => () => {
        //revoke the data urls to avoid memory leaks
        myFiles.forEach(file => URL.revokeObjectURL(file.preview));
      }, [myFiles]);

    const onDrop = useCallback(acceptedFiles => {
        setMyFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [myFiles])
    
    const removeAll = () => {
        setMyFiles([])
    }
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxSize: 5242880, 
        accept: "image/jpeg",
        multiple: false
    })

    function likePost(event,feedPostID,index){
        if (!event) var event = window.event;
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        axios.post("/api/like-unlike",{
            postToLike: feedPostID
        })
        .then((response) => {
            let updatedPosts = [...feedPosts];
            if (response.data === 'like') {
            updatedPosts[index].like_count++;
            setPosts(updatedPosts);
            }
            else {
                updatedPosts[index].like_count--;
                setPosts(updatedPosts);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    function flagPost(event,feedPostID){
        if (!event) var event = window.event;
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        axios.post("/api/flag-unflag",{
            postToFlag: feedPostID
        })
        .then((response) => {
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function getPosts(){
        axios.get('/api/posts')
        .then(response =>{
            // setFeedPosts(response.data);
        })
        .catch(err =>{
            console.log("Error: ");
            console.log(err);
        })
    }

    function submitPost(event){
        event.preventDefault();
        let config = {
            headers: {
                'Content-type': 'image/jpeg'  //configure headers for put request to s3 bucket
            }
        }

        setLoading(true)
        if(myFiles.length !== 0){
            //try to upload photo first
            axios.get(apiGatewayURL)  //first get the presigned s3 url
            .then((response) =>{
                let presignedFileURL =  'https://csc648groupproject.s3-us-west-2.amazonaws.com/' + response.data.photoFilename;  //save this url to add to database later
                axios.put(response.data.uploadURL, myFiles[0],config).then((response) =>{  //upload the file to s3
                    axios.post('/api/upload-post',{
                        postBody: createdPostBody,
                        photoLink: presignedFileURL,
                        taggedPets: taggedPets
                    }).then((response) =>{
                        removeAll();
                        setCreatedPostBody('');
                        setTaggedPets([]);
                        setLoading(false);
                        setTimeout(() => {
                            history.push('/');
                        }, 1000)
                    })
                    .catch((err) =>{
                        setLoading(false);
                    })
                })
                .catch((err) =>{
                    setLoading(false);
                    if(err.response.status == 403){
                        //display error message to user
                    }
                    //break out of this function //presigned s3 url will automatically expire so no harm done
                })
            })
            .catch((err) =>{
                setLoading(false);
            })

            //refresh feed after posting
            // getPosts();
            // setFeedPosts([...feedPosts, ])

        }
        else{
            axios.post('/api/upload-post',{
                postBody: createdPostBody,
                taggedPets: taggedPets
            }).then((response) =>{
                setCreatedPostBody('');
                setTaggedPets([]);
                setLoading(false);
                setTimeout(() => {
                    history.push('/');
                }, 2000)
            })
            .catch((err) =>{
                setLoading(false);
            })

            //refresh feed after posting
            //getPosts();
        }

    }

    function openPostModal(event,feedPost) {
        if (!event) var event = window.event;
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        setSelectedPost(feedPost);
        setPostModalDisplay(true);
        return
    }

    function goToProfile(event,profileID){
        //stop from opening post modal
        if (!event) var event = window.event;
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();

        const location = {
            pathname: "/Profile/" + profileID,
          }
          history.push(location);
    }

    function closePostModal() {
        setPostModalDisplay(false);
    }

    let displayFeed = (
        <div className={`${styles["follower-feed-container"]} ${"container"}`}>
                <div className={styles["follower-feed-header"]}></div>
                <form className={styles["follower-feed-new-post"]} onSubmit={submitPost}>
                    <img className={styles["follower-feed-new-post-pic"]} src={createPostProfilePic} />
                    <div className={styles["follower-feed-new-post-name"]}>{createPostDisplayName}</div>
                    <textarea value={createdPostBody} maxLength="255" required className={styles["follower-feed-new-post-body"]} placeholder="Update your followers on what's going on with you and your pets"  onChange={e => setCreatedPostBody(e.target.value)}/>
                    <div className={styles['follower-feed-new-post-tag-dropdown']}>
                        <Select
                            onChange={setTaggedPets}
                            options={taggablePets}
                            placeholder="Tag a Pet in your Post"
                            theme={customTheme}
                            styles={customStyles}
                            isSearchable
                            isMulti
                            value={taggedPets}
                            noOptionsMessage={() => 'Add a Pet to Your Account on the My Pets Page'}
                        />
                    </div>
                    <section className={styles["follower-feed-new-post-attach-image"]}>
                        <div className={styles["follower-feed-new-post-attach-image-container"]}  {...getRootProps()}>
                            <input  {...getInputProps()} />
                            {myFiles.length === 0 && <div className={styles["follower-feed-new-post-attach-image-info"]}>Drag and Drop or Click to Select Image</div>}
                            {myFiles.length > 0 && <>
                                <img className={styles["follower-feed-new-post-attach-image-preview"]} src={myFiles[0].preview} onClick={removeAll}/>
                                <button className={styles["follower-feed-new-post-attach-image-container-button"]} onClick={removeAll} >remove</button>
                            </>}
                        </div>
                    </section>
                    <button className={styles["follower-feed-new-post-submit"]} type='submit'>{loading ? <ButtonLoader /> : 'Submit'}</button>
                    {/* <button className={styles["follower-feed-new-post-expand-collapse"]} /> onClick={createPostOverlayToggle} */}
                </form>
                {feedPosts.length == 0 &&
                    <>
                    <div className={styles['follower-feed-no-posts-placeholder-header']}>
                        No Feed Posts to show :(
                    </div>
                    <div className={styles['follower-feed-no-posts-placeholder-detail']}>
                        Search for a User and Follow them to see their posts here
                    </div>
                    </>}
                {feedPosts && feedPosts.map((feedPost, index) => {
                    if(feedPosts.length === index + 1){
                        return (
                            <div ref={lastPostElementRef} key={feedPost.post_id} className={styles["follower-feed-post"]} onClick={(event) => openPostModal(event,feedPost)} >
                                <img className={styles["follower-feed-post-prof_pic"]} src={feedPost.profile_pic_link} onClick={(event) => goToProfile(event,feedPost.profile_id)}/>
                                <div className={styles["follower-feed-post-name"]} onClick={(event) => goToProfile(event,feedPost.profile_id)}>{feedPost.display_name}</div>
                                <div className={styles["follower-feed-post-timestamp"]}>{new Date(feedPost.timestamp).toLocaleString()}</div>
                                {/* <div className={styles["follower-feed-post-admin-flags"]}>
                                    <span className={styles["follower-feed-post-like-count"]}>{feedPost.like_count}</span>
                                    <img className={styles["follower-feed-post-like-icon"]} src={LikeIcon} onClick={(event) => likePost(event,feedPost.post_id,index)}/>
                                </div> */}
                                <span className={styles['follower-feed-post-flag']} onClick={(event) => flagPost(event,feedPost.post_id)}>Flag</span>
                                {/* <div className={styles["follower-feed-post-comments"]}>10 comments</div> */}
                                <div className={styles["follower-feed-post-body"]}>{feedPost.body}</div>
                                {feedPost.link && <img className={styles["follower-feed-post-pic"]} src={feedPost.link} />}
                            </div>
                        )
                    }
                    else{
                        return (
                            <div key={feedPost.post_id} className={styles["follower-feed-post"]} onClick={(event) => openPostModal(event,feedPost)} >
                                <img className={styles["follower-feed-post-prof_pic"]} src={feedPost.profile_pic_link} onClick={(event) => goToProfile(event,feedPost.profile_id)}/>
                                <div className={styles["follower-feed-post-name"]} onClick={(event) => goToProfile(event,feedPost.profile_id)}>{feedPost.display_name}</div>
                                <div className={styles["follower-feed-post-timestamp"]}>{new Date(feedPost.timestamp).toLocaleString()}</div>
                                {/* <div className={styles["follower-feed-post-admin-flags"]}>
                                    <span className={styles["follower-feed-post-like-count"]}>{feedPost.like_count}</span>
                                    <img className={styles["follower-feed-post-like-icon"]} src={LikeIcon} onClick={(event) => likePost(event,feedPost.post_id,index)}/>
                                </div> */}
                                <span className={styles['follower-feed-post-flag']} onClick={(event) => flagPost(event,feedPost.post_id)}>Flag</span>
                                {/* <div className={styles["follower-feed-post-comments"]}>10 comments</div> */}
                                <div className={styles["follower-feed-post-body"]}>{feedPost.body}</div>
                                {feedPost.link && <img className={styles["follower-feed-post-pic"]} src={feedPost.link} />}
                            </div>
                        )
                    }
                })}
            </div>
    )

    if (redirectContext.loading) {
        displayFeed = <Spinner />
    }

    return (
        <>
            {displayFeed}
            <PostModal display={postModalDisplay} onClose={closePostModal} selectedPost={selectedPost} />
        </>
    )
}

export default Feed
