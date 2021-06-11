import React from 'react'

function TermsValidation(termsAcceptance) {
    let termsErr = ''
    if(!termsAcceptance){
        termsErr = 'You must accept the Terms and Privacy Policy to Create an Account'
    }

    return (termsErr)
}

export default TermsValidation
