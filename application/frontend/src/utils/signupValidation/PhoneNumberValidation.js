function PhoneNumberValidation(phoneNumber) {
  let phoneNumberErr = "";

  if (!phoneNumber) {
    phoneNumberErr = "Please enter your business's phone number";
  }

  return phoneNumberErr;
}

export default PhoneNumberValidation;
