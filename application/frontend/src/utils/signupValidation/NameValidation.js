import React from 'react'

function NameValidation(name) {
    let nameErr = "";

    if (!name){
        nameErr = "Please enter an Email"
    }

    return (nameErr)
}

export default NameValidation