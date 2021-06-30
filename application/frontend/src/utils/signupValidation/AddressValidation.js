function AddressValidation(address) {
  let addressErr = "";

  if (!address) {
    addressErr = "Please enter a valid address";
  }

  ////console.log("addressErr: ", addressErr);
  return addressErr;
}

export default AddressValidation;
