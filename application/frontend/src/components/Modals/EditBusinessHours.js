import { useState } from "react";
import axios from "axios";

import BaseSelect from "react-select";
import FixRequiredSelect from "../../mods/FixRequiredSelect";

import Modal from "./Modal";

import styles from "./EditBusinessHours.module.css";

import SelectCustomTheme from "../../mods/SelectCustomTheme";

const hourOptions = [
  { value: "00:00:00", label: "Closed" },
  { value: "01:00:00", label: "1:00 AM" },
  { value: "02:00:00", label: "2:00 AM" },
  { value: "03:00:00", label: "3:00 AM" },
  { value: "04:00:00", label: "4:00 AM" },
  { value: "05:00:00", label: "5:00 AM" },
  { value: "06:00:00", label: "6:00 AM" },
  { value: "07:00:00", label: "7:00 AM" },
  { value: "08:00:00", label: "8:00 AM" },
  { value: "09:00:00", label: "9:00 AM" },
  { value: "10:00:00", label: "10:00 AM" },
  { value: "11:00:00", label: "11:00 AM" },
  { value: "12:00:00", label: "12:00 PM" },
  { value: "13:00:00", label: "1:00 PM" },
  { value: "14:00:00", label: "2:00 PM" },
  { value: "15:00:00", label: "3:00 PM" },
  { value: "16:00:00", label: "4:00 PM" },
  { value: "17:00:00", label: "5:00 PM" },
  { value: "18:00:00", label: "6:00 PM" },
  { value: "19:00:00", label: "7:00 PM" },
  { value: "20:00:00", label: "8:00 PM" },
  { value: "21:00:00", label: "9:00 PM" },
  { value: "22:00:00", label: "10:00 PM" },
  { value: "23:00:00", label: "11:00 PM" },
  { value: "24:00:00", label: "12:00 AM" },
];

const Select = (props) => (
  <FixRequiredSelect
    {...props}
    SelectComponent={BaseSelect}
    options={props.options}
  />
);

function EditBusinessHours({ display, onClose, hours, setHours }) {
  //convert hours into hour options usable as values for react-select
  const [sundayStart, setSundayStart] = useState(hours.sun_open);
  const [mondayStart, setMondayStart] = useState(hours.mon_open);
  const [tuesdayStart, setTuesdayStart] = useState(hours.tue_open);
  const [wednesdayStart, setWednesdayStart] = useState(hours.wed_open);
  const [thursdayStart, setThursdayStart] = useState(hours.thu_open);
  const [fridayStart, setFridayStart] = useState(hours.fri_open);
  const [saturdayStart, setSaturdayStart] = useState(hours.sat_open);

  const [sundayEnd, setSundayEnd] = useState(hours.sun_close);
  const [mondayEnd, setMondayEnd] = useState(hours.mon_close);
  const [tuesdayEnd, setTuesdayEnd] = useState(hours.tue_close);
  const [wednesdayEnd, setWednesdayEnd] = useState(hours.wed_close);
  const [thursdayEnd, setThursdayEnd] = useState(hours.thu_close);
  const [fridayEnd, setFridayEnd] = useState(hours.fri_close);
  const [saturdayEnd, setSaturdayEnd] = useState(hours.sat_close);

  function submitHoursEdit() {
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
        setHours({
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
            onChange={(event) => setSundayStart([event])}
            options={hourOptions}
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
            options={hourOptions}
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
            options={hourOptions}
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
            options={hourOptions}
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
            options={hourOptions}
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
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={tuesdayEnd}
            required
          />
        </div>
        <div className={styles["edit-wednesday-hours-start"]}>
          <label for="wednesday-start">Wednesday Start</label>
          <Select
            id="wednesday-start"
            name="wednesday_start"
            onChange={setWednesdayStart}
            options={hourOptions}
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
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={wednesdayEnd}
            required
          />
        </div>
        <div className={styles["edit-thursday-hours-start"]}>
          <label for="thursday-start">Thursday Start</label>
          <Select
            id="thursday-start"
            name="thursday_start"
            onChange={setThursdayStart}
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={thursdayStart}
            required
          />
        </div>
        <div className={styles["edit-thursday-hours-end"]}>
          <label for="thursday-end">Thursday End</label>
          <Select
            id="thursday-end"
            name="thursday_end"
            onChange={setThursdayEnd}
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={thursdayEnd}
            required
          />
        </div>
        <div className={styles["edit-friday-hours-start"]}>
          <label for="friday-start">Friday Start</label>
          <Select
            id="friday-start"
            name="friday_start"
            onChange={setFridayStart}
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            value={fridayStart}
            required
          />
        </div>
        <div className={styles["edit-friday-hours-end"]}>
          <label for="friday-end">Friday End</label>
          <Select
            id="friday-end"
            name="friday_end"
            onChange={setFridayEnd}
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            value={fridayEnd}
            required
          />
        </div>
        <div className={styles["edit-saturday-hours-start"]}>
          <label for="saturday-start">Saturday Start</label>
          <Select
            id="saturday-start"
            name="saturday_start"
            onChange={setSaturdayStart}
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Opening Hours"
            isSearchable
            maxMenuHeight={45}
            value={saturdayStart}
            required
          />
        </div>
        <div className={styles["edit-saturday-hours-end"]}>
          <label for="saturday-end">Saturday End</label>
          <Select
            id="saturday-end"
            name="saturday_end"
            onChange={setSaturdayEnd}
            options={hourOptions}
            theme={SelectCustomTheme}
            placeholder="Closing Hours"
            isSearchable
            maxMenuHeight={45}
            value={saturdayEnd}
            required
          />
        </div>
        <button className={styles["edit-business-hours-submit"]}>Submit</button>
      </form>
    </Modal>
  );
}

export default EditBusinessHours;
