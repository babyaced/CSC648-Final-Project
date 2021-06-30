import { useContext, useState } from "react";
import Modal from "./Modal";

import axios from "axios";

import styles from "./EditAddress.module.css";

//For address Editing
import "@reach/combobox";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";
//For Address Editing

function EditAddress({ display, onClose }) {
  const { profile, editAddress } = useContext(ProfileContext);
  const [address, setAddress] = useState(profile.address);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  function submitAddressEdit() {
    axios
      .put("/api/business/address", {
        newAddress: address,
        newLatitude: latitude,
        newLongitude: longitude,
      })
      .then((response) => {
        onClose();
      })
      .catch((err) => {
        //console.log(err);
        //show error message in modal
      });
    editAddress(address);
    onClose();
  }

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

  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["edit-address-header"]}>Edit Address</div>
      <div className={styles["edit-address-container"]}>
        <Combobox
          className={styles["edit-address-input-container"]}
          onSelect={async (address) => {
            setValue(address, false);
            clearSuggestions();
            try {
              const results = await getGeocode({ address });
              const { lat, lng } = await getLatLng(results[0]);
              setLatitude(lat);
              setLongitude(lng);
            } catch (error) {
              ////console.log("error!");
            }
            setAddress(address);
          }}
        >
          <ComboboxInput
            className={styles["edit-address-input"]}
            value={value}
            placeholder="Start Typing an Address"
            onChange={(e) => {
              setValue(e.target.value);
              //record lat lng to store in database
            }}
            required
            disabled={!ready}
          />
          <ComboboxPopover className={styles["combobox-popover"]}>
            <ComboboxList className={styles["combobox-list"]}>
              {status === "OK" &&
                data.map(({ id, description }) => (
                  <ComboboxOption key={id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
        <button
          className={styles["edit-address-submit"]}
          onClick={submitAddressEdit}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default EditAddress;
