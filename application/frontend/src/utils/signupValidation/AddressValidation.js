function AddressValidation(address, latitude, longitude) {
  let addressErr = "";

  console.log("Address: ", address);
  console.log("Latitude: ", latitude);
  console.log("Longitude: ", longitude);

  if (!address) {
    addressErr = "Please search for an address";
  } else if (address && !latitude && !longitude) {
    addressErr = "Please select an Address";
  }

  ////console.log("addressErr: ", addressErr);
  return addressErr;
}

export default AddressValidation;
