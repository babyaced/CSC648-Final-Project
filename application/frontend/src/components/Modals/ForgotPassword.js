import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "./Modal.js";

import styles from "./ForgotPassword.module.css";

function ForgotPassword({ display, onClose }) {
  const [email, setEmail] = useState("");

  function resetPassword() {
    axios
      .post("/api/password-reset", {
        email: email,
      })
      .then((response) => {
        ////console.log(response);
      })
      .catch((err) => {
        ////console.log(err);
      });
  }

  return (
    <Modal display={display} onClose={onClose}>
      <form
        className={styles["reset-password-container"]}
        onSubmit={resetPassword}
      >
        <div className={styles["reset-password-header"]}> Reset Password</div>
        <input
          type="email"
          className={styles["reset-password-email-field"]}
          placeholder="Enter your email address"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" class={styles["reset-password-button"]}>
          Reset Password
        </button>
      </form>
    </Modal>
  );
}

export default ForgotPassword;
