import React from 'react'

function EmailValidation(email) {
    let emailErr = "";
    console.log('email: ', email);

    if(!email.includes('@')){
        emailErr = 'Invalid Email';
    }

    return (emailErr)
}

export default EmailValidation
