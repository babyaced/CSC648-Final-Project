import React from 'react'

//import CSS
import styles from './CommentCard.module.css'

function CommentCard({comment}) {
    return (
        <li key={comment.comment_id}>
            <div className={styles['post-comment']}>
                <img className={styles['post-comment-pic']} src={comment.profile_pic_link}/>
                <div className={styles['post-comment-name']}><h4>{comment.display_name}</h4></div>
                <div className={styles['post-comment-timestamp']}>{new Date(comment.timestamp).toLocaleString()}</div>
                <div className={styles['post-comment-body']}>{comment.body}</div>
                {/* <div className={styles['post-comment-likes']}>
                    {comment.like_count}  
                </div>
                <button className={styles['post-comment-like']}/> */}
            </div>
        </li>
    )
}

export default CommentCard
