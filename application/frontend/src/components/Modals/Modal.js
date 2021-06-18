import { useEffect } from "react";
import ReactDom from "react-dom";

import styles from "./Modal.module.css";

function Modal({ display, children, onClose }) {
  useEffect(() => {
    //to disable scrolling behind modal
    if (display) {
      //componentDidMount
      document.body.style.overflow = "hidden";
    }

    return () => {
      //componentWillUnmount
      document.body.style.overflow = "unset";
    };
  }, [display]); //if display changes

  if (!display) return null;
  return ReactDom.createPortal(
    <>
      <div className={styles["overlay"]} />
      <div className={styles["modal"]}>
        {children}
        <button onClick={onClose} className={styles["exit-button"]} />
      </div>
    </>,
    document.getElementById("modal-portal")
  );
}

export default Modal;
