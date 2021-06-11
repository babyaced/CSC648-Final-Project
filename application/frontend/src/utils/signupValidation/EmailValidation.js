import React from 'react'

function EmailValidation(email) {
    let emailErr = "";
    console.log('email: ', email);

    try {
        if(!email.includes('@')){
            emailErr = 'Invalid Email';
        }
    } catch (err) {
        console.log(err)
        emailErr = "Please enter an Email"
    }

    return (emailErr)
}

export default EmailValidation
