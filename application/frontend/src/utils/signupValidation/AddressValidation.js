function AddressValidation(address) {
    let addressErr = "";

    if (!address){
        addressErr = "Please enter a valid address"
    }
    return (addressErr)
}

export default AddressValidation