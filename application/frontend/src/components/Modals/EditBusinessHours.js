import { useContext, useState } from "react";
import axios from "axios";

import BaseSelect from "react-select";
import FixRequiredSelect from "../../mods/FixRequiredSelect";

import Modal from "./Modal";

import styles from "./EditBusinessHours.module.css";

import SelectCustomTheme from "../../mods/SelectCustomTheme";

import HourOptions from "../DropdownOptions/hourOptions";
import { ProfileContext } from "../../pages/Profile/ProfileProvider";

const Select = (props) => (
  <FixRequiredSelect
    {...props}
    SelectComponent={BaseSelect}
    options={props.options}
  />
);

function EditBusinessHours({ display, onClose }) {
  const { profile, editHours } = useContext(ProfileContext);

  console.log(profile.hours);

  //convert hours into hour options usable as values for react-select
  const [sundayStart, setSundayStart] = useState(profile.hours.sun_open);
  const [mondayStart, setMondayStart] = useState(profile.hours.mon_open);
  const [tuesdayStart, setTuesdayStart] = useState(profile.hours.tue_open);
  const [wednesdayStart, setWednesdayStart] = useState(profile.hours.wed_open);
  const [thursdayStart, setThursdayStart] = useState(profile.hours.thu_open);
  const [fridayStart, setFridayStart] = useState(profile.hours.fri_open);
  const [saturdayStart, setSaturdayStart] = useState(profile.hours.sat_open);

  const [sundayEnd, setSundayEnd] = useState(profile.hours.sun_close);
  const [mondayEnd, setMondayEnd] = useState(profile.hours.mon_close);
  const [tuesdayEnd, setTuesdayEnd] = useState(profile.hours.tue_close);
  const [wednesdayEnd, setWednesdayEnd] = useState(profile.hours.wed_close);
  const [thursdayEnd, setThursdayEnd] = useState(profile.hours.thu_close);
  const [fridayEnd, setFridayEnd] = useState(profile.hours.fri_close);
  const [saturdayEnd, setSaturdayEnd] = useState(profile.hours.sat_close);

  function submitHoursEdit(event) {
    event.preventDefault();
    axios
      .post("/api/hours", {
        newSunOpen: sundayStart["value"],
        newSunClose: sundayEnd["value"],
        newMonOpen: mondayStart["value"],
        newMonClose: mondayEnd["value"],
        newTueOpen: tuesdayStart["value"],
        newTueClose: tuesdayEnd["value"],
        newWedOpen: wednesdayStart["value"],
        newWedClose: wednesdayEnd["value"],
        newThuOpen: thursdayStart["value"],
        newThuClose: thursdayEnd["value"],
        newFriOpen: fridayStart["value"],
        newFriClose: fridayEnd["value"],
        newSatOpen: saturdayStart["value"],
        newSatClose: saturdayEnd["value"],
      })
      .then((response) => {
        editHours({
          sun_open: sundayStart,
          sun_close: sundayEnd,
          mon_open: mondayStart,
          mon_close: mondayEnd,
          tue_open: tuesdayStart,
          tue_close: tuesdayEnd,
          wed_open: wednesdayStart,
          wed_close: wednesdayEnd,
          thu_open: thursdayStart,
          thu_close: thursdayEnd,
          fri_open: fridayStart,
          fri_close: fridayEnd,
          sat_open: saturdayStart,
          sat_close: saturdayEnd,
        });
        onClose();
      })
      .catch((err) => {
        console.log(err);
        //display error message
      });
  }

  return (
    <Modal display={display} onClose={onClose}>
      <div className={styles["edit-business-hours-header"]}>
        Edit Business Hours
      </div>
      <form
        className={styles["edit-business-hours-container"]}
        onSubmit={submitHoursEdit}
      >
        <div className={styles["edit-sunday-hours-start"]}>
          <label for="sunday-start">Sunday Opening</label>
          <Select
            id="sunday-start"
            name="sunday_start"
            onChange={setSundayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={sundayStart}
            required
          />
        </div>
        <div className={styles["edit-sunday-hours-end"]}>
          <label for="sunday-end">Sunday Closing</label>
          <Select
            id="sunday-end"
            name="sunday_end"
            onChange={setSundayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={sundayEnd}
            required
          />
        </div>
        <div className={styles["edit-monday-hours-start"]}>
          <label for="monday-start">Monday Opening</label>
          <Select
            id="monday-start"
            name="monday_start"
            onChange={setMondayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={mondayStart}
            required
          />
        </div>
        <div className={styles["edit-monday-hours-end"]}>
          <label for="monday-end">Monday Closing</label>
          <Select
            id="monday-end"
            name="monday_end"
            onChange={setMondayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={mondayEnd}
            required
          />
        </div>
        <div className={styles["edit-tuesday-hours-start"]}>
          <label for="tuesday-start">Tuesday Opening</label>
          <Select
            id="tuesday-start"
            name="tuesday_start"
            onChange={setTuesdayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={tuesdayStart}
            required
          />
        </div>
        <div className={styles["edit-tuesday-hours-end"]}>
          <label for="tuesday-end">Tuesday Closing</label>
          <Select
            id="tuesday-end"
            name="tuesday_end"
            onChange={setTuesdayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={tuesdayEnd}
            required
          />
        </div>
        <div className={styles["edit-wednesday-hours-start"]}>
          <label for="wednesday-start">Wednesday Opening</label>
          <Select
            id="wednesday-start"
            name="wednesday_start"
            onChange={setWednesdayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={wednesdayStart}
            required
          />
        </div>
        <div className={styles["edit-wednesday-hours-end"]}>
          <label for="wednesday-end">Wednesday Closing</label>
          <Select
            id="wednesday-end"
            name="wednesday_end"
            onChange={setWednesdayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={wednesdayEnd}
            required
          />
        </div>
        <div className={styles["edit-thursday-hours-start"]}>
          <label for="thursday-start">Thursday Opening</label>
          <Select
            id="thursday-start"
            name="thursday_start"
            onChange={setThursdayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={thursdayStart}
            required
          />
        </div>
        <div className={styles["edit-thursday-hours-end"]}>
          <label for="thursday-end">Thursday Closing</label>
          <Select
            id="thursday-end"
            name="thursday_end"
            onChange={setThursdayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={thursdayEnd}
            required
          />
        </div>
        <div className={styles["edit-friday-hours-start"]}>
          <label for="friday-start">Friday Opening</label>
          <Select
            id="friday-start"
            name="friday_start"
            onChange={setFridayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={fridayStart}
            required
          />
        </div>
        <div className={styles["edit-friday-hours-end"]}>
          <label for="friday-end">Friday Closing</label>
          <Select
            id="friday-end"
            name="friday_end"
            onChange={setFridayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={fridayEnd}
            required
          />
        </div>
        <div className={styles["edit-saturday-hours-start"]}>
          <label for="saturday-start">Saturday Opening</label>
          <Select
            id="saturday-start"
            name="saturday_start"
            onChange={setSaturdayStart}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            maxMenuHeight={45}
            value={saturdayStart}
            required
          />
        </div>
        <div className={styles["edit-saturday-hours-end"]}>
          <label for="saturday-end">Saturday Closing</label>
          <Select
            id="saturday-end"
            name="saturday_end"
            onChange={setSaturdayEnd}
            options={HourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            maxMenuHeight={45}
            value={saturdayEnd}
            required
          />
        </div>
        <button className={styles["edit-business-hours-submit"]} type="submit">
          Submit
        </button>
      </form>
    </Modal>
  );
}

export default EditBusinessHours;
