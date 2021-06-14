function BusinessNameValidation(businessName) {
    let businessNameErr = "";

    if (!businessName){
        businessNameErr = "Please enter your business's name"
    }

    return (businessNameErr)
}

export default BusinessNameValidation