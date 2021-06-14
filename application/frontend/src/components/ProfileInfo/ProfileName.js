import React from 'react'

function ProfileName() {
    return (
        <h1 className={styles.UserName} >
            <input 
                value={displayName} 
                readOnly={!editing}
                maxLength = "25"
                onChange={event => setDisplayName(event.target.value)} 
            />
        </h1> 
    )
}

export default ProfileName
