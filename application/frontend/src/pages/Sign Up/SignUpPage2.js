import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import styles from "./SignUpPage.module.css";

import BaseSelect from "react-select";
import FixRequiredSelect from "../../mods/FixRequiredSelect";
import makeAnimated from "react-select/animated";

//Import Modals
import TermsAndConditions from "../../components/Modals/TermsAndConditions";
import PrivacyPolicy from "../../components/Modals/PrivacyPolicy";

//For address input and suggestions
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import BusinessNameValidation from "../../utils/signupValidation/BusinessNameValidation";
import AddressValidation from "../../utils/signupValidation/AddressValidation";
import PhoneNumberValidation from "../../utils/signupValidation/PhoneNumberValidation";
import TermsValidation from "../../utils/signupValidation/TermsValidation";

import useTypeOptions from "../../components/DropdownOptions/useTypeOptions";
import useBusinessCategoryOptions from "../../components/DropdownOptions/useBusinessCategoryOptions";

import SelectCustomTheme from "../../mods/SelectCustomTheme";

import ButtonLoader from "../../components/UI/Spinner/ButtonLoader";
import ServerErrorMessage from "../../components/InfoMessages/ServerErrorMessage";

let typeOptions = []; //for storing business type options

//use select with required attribute
const Select = (props) => (
  <FixRequiredSelect
    {...props}
    SelectComponent={BaseSelect}
    options={props.options || typeOptions}
  />
);

function SignUpPage2(props) {
  const location = useLocation();
  let state = props.location.state;
  let type = props.location.type;

  let typeOptions = [];
  const [businessCategoryOptions] = useBusinessCategoryOptions();
  const [petTypeOptions] = useTypeOptions();
  type === "business"
    ? (typeOptions = businessCategoryOptions)
    : (typeOptions = petTypeOptions);

  const [termsAndConditionsDisplay, setTermsAndConditionsDisplay] =
    useState(false);
  const [privacyPolicyDisplay, setPrivacyPolicyDisplay] = useState(false);

  const [serverError, setServerError] = useState(false);

  const [selectedBusinessType, setSelectedBusinessType] = useState();
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);

  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [acceptTerms, setAcceptTerms] = useState(false);

  //Error states for input fields
  const [businessNameError, setBusinessNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [termsError, setTermsError] = useState("");

  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: "37px",
      "min-height": "37px",
      "border-radius": "7.5px",
    }),
  };

  const invalidStyle = {
    control: (base, state) => ({
      ...base,
      height: "37px",
      "min-height": "37px",
      "border-radius": "7.5px",
      border: "2px solid red",
    }),
  };

  const animatedComponents = makeAnimated();

  const history = useHistory();

  //Use Places Autocomplete call
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 37.773972, lng: () => -122.431297 },
      radius: 200 * 1000,
    },
  });

  function validateForm() {
    let businessNameErr = BusinessNameValidation(businessName);
    let phoneNumberErr = PhoneNumberValidation(phoneNumber);
    let addressErr = AddressValidation(address, latitude, longitude);
    let termsErr = TermsValidation(acceptTerms);

    setBusinessNameError(businessNameErr);
    setPhoneNumberError(phoneNumberErr);
    setAddressError(addressErr);
    setTermsError(termsErr);

    if (businessNameErr || phoneNumberErr || addressErr || termsErr) {
      return false;
    }

    ////console.log("no errors");
    return true;
  }

  function signUpBusiness(event) {
    event.preventDefault();
    setSignUpLoading(true);

    const valid = validateForm();

    if (!valid) {
      setSignUpLoading(false);
    } else if (valid) {
      type === "business"
        ? Axios.post(
            "/api/signup/business",
            {
              email: state.email,
              firstName: state.firstName,
              lastName: state.lastName,
              uname: state.username,
              password: state.password,
              redonePassword: state.redonePassword,
              businessName: businessName,
              phoneNumber: phoneNumber,
              address: address,
              latitude: latitude,
              longitude: longitude,
              type: selectedBusinessType.value,
            },
            { withCredentials: true }
          )
            .then((response) => {
              if (response.data === "SUCCESS") {
                history.push("/SignUpSuccess");
              }
            })
            .catch((error) => {
              if (error.response.status === 500) {
                setSignUpLoading(false);
                setServerError(true);
              }
              ////console.log(error);
            })
        : Axios.post(
            "/api/signup/shelter",
            {
              email: state.email,
              firstName: state.firstName,
              lastName: state.lastName,
              uname: state.username,
              password: state.password,
              redonePassword: state.redonePassword,
              businessName: businessName,
              phoneNumber: phoneNumber,
              address: address,
              latitude: latitude,
              longitude: longitude,
              petTypes: selectedPetTypes,
            },
            { withCredentials: true }
          )
            .then((response) => {
              if (response.data === "SUCCESS") {
                history.push("/SignUpSuccess");
              }
            })
            .catch((error) => {
              if (error.response.status === 500) {
                setSignUpLoading(false);
                setServerError(true);
              }
              ////console.log(error);
            });
    }
  }
  let comboboxInputStyle = "valid";
  if (addressError) {
    comboboxInputStyle = "invalid";
  } else if (latitude && longitude) {
    comboboxInputStyle = "location";
  }

  return (
    <>
      <form
        className={`${styles["signup-container"]} ${"small-container"}`}
        onSubmit={signUpBusiness}
      >
        <div className={styles["signup-header"]}>
          {type === "business" ? <h2>Business Info</h2> : <h2>Shelter Info</h2>}
        </div>
        <div className={styles["signup-fields-container"]}>
          <div className={styles["name-input-container"]}>
            <label className={styles["name-input-label"]} for="business-name">
              Business Name
            </label>
            {!businessNameError ? (
              <input
                type="text"
                placeholder="Enter Business Name"
                name="business-name"
                oninvalid={() => {
                  ////console.log("");
                }}
                onChange={(e) => setBusinessName(e.target.value)}
                className={styles.valid}
                disabled={signUpLoading}
              />
            ) : (
              <input
                type="text"
                placeholder="Enter Business Name"
                name="business-name"
                oninvalid={() => {
                  ////console.log("");
                }}
                onChange={(e) => setBusinessName(e.target.value)}
                className={styles.invalid}
                disabled={signUpLoading}
              />
            )}
            <span className={styles["termsError"]}>{businessNameError}</span>
          </div>

          <div className={styles["phone-number-input-container"]}>
            <label
              className={styles["phone-number-input-label"]}
              for="business-phone-number"
            >
              Phone Number
            </label>
            {!phoneNumberError ? (
              <input
                type="text"
                placeholder="(000) 000-0000"
                name="business-phone-number"
                pattern="[0-9]*"
                maxLength={10}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.valid}
                disabled={signUpLoading}
              />
            ) : (
              <input
                type="text"
                placeholder="(000) 000-0000"
                name="business-phone-number"
                pattern="[0-9]*"
                maxLength={10}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.invalid}
                disabled={signUpLoading}
              />
            )}
            <span className={styles["termsError"]}>{phoneNumberError}</span>
          </div>

          <div className={styles["address-input-container"]}>
            <label
              className={styles["address-input-label"]}
              for="business-address"
            >
              Business Address
            </label>
            <Combobox
              onSelect={async (address) => {
                setLocationConfirmed(true);
                setValue(address, false);
                clearSuggestions();
                try {
                  const results = await getGeocode({ address });
                  const { lat, lng } = await getLatLng(results[0]);
                  setLatitude(lat);
                  setLongitude(lng);
                  setAddress(address);
                } catch (error) {
                  ////console.log("error!");
                }
              }}
            >
              <ComboboxInput
                value={value}
                placeholder="Start Typing an Address"
                onChange={(e) => {
                  setValue(e.target.value);
                  //record lat lng to store in database
                }}
                // required
                disabled={!ready || signUpLoading}
                className={styles[comboboxInputStyle]}
              />
              <ComboboxPopover>
                <ComboboxList className={styles["combobox-list"]}>
                  {status === "OK" &&
                    data.map(({ id, description }) => (
                      <ComboboxOption key={id} value={description} />
                    ))}
                </ComboboxList>
              </ComboboxPopover>
            </Combobox>
            <span className={styles["termsError"]}>{addressError}</span>
          </div>
          <div className={styles["types-input-container"]}>
            {type === "business" ? (
              <>
                <label
                  className={styles["types-input-label"]}
                  for="business-categories"
                >
                  Business Categories
                </label>
                <Select
                  id="business-type"
                  name="business_type"
                  className={styles["Select"]}
                  onChange={setSelectedBusinessType}
                  options={typeOptions}
                  placeholder="Business Type"
                  theme={SelectCustomTheme}
                  styles={customStyles}
                  isSearchable
                  // isMulti
                  components={animatedComponents}
                  disabled={signUpLoading}
                  // required
                />
              </>
            ) : (
              <>
                <label
                  className={styles["types-input-label"]}
                  for="business-categories"
                >
                  Shelter Animals
                </label>
                <Select
                  id="business-type"
                  name="business_type"
                  className={styles["Select"]}
                  onChange={setSelectedPetTypes}
                  options={typeOptions}
                  placeholder="Shelter Animals"
                  theme={SelectCustomTheme}
                  styles={customStyles}
                  isSearchable
                  isMulti
                  components={animatedComponents}
                  disabled={signUpLoading}
                  // required
                />
              </>
            )}
          </div>

          <div className={styles["checkbox-container"]}>
            <span>By creating an account you agree to our:</span>
            <span>
              <span
                className={styles["terms-button"]}
                onClick={() => setTermsAndConditionsDisplay(true)}
              >
                {" "}
                Terms{" "}
              </span>
              &
              <span
                className={styles["policy-button"]}
                onClick={() => setPrivacyPolicyDisplay(true)}
              >
                {" "}
                Privacy Policy{" "}
              </span>
              <input
                type="checkbox"
                name="remember"
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={signUpLoading}
              />
            </span>
            <span className={styles["termsError"]}>{termsError}</span>
          </div>
        </div>
        <button type="submit" className={styles["submit-btn"]}>
          {signUpLoading ? <ButtonLoader message={"Sign Up"} /> : "Sign Up"}
        </button>
      </form>
      {/* Modals */}
      <TermsAndConditions
        display={termsAndConditionsDisplay}
        onClose={() => setPrivacyPolicyDisplay(false)}
      />
      <PrivacyPolicy
        display={privacyPolicyDisplay}
        onClose={() => setTermsAndConditionsDisplay(false)}
      />
      <ServerErrorMessage serverError={serverError} />
    </>
  );
}

export default SignUpPage2;
