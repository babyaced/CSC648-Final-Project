import React from 'react'

function UsernameValidation(username) {

    let usernameErr = "";

    if (!username){
        usernameErr = "Please enter an Email"
    }

    if(username.length < 6 || username.length > 30){
        usernameErr = "Username must be 3-20 characters"
    }

    return (usernameErr)
}

export default UsernameValidation