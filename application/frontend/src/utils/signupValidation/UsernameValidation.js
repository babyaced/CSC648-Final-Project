import React from 'react'

function UsernameValidation(username) {

    let usernameErr = "";

    if (!username){
        usernameErr = "Please enter an Email"
    }

    return (usernameErr)
}

export default UsernameValidation