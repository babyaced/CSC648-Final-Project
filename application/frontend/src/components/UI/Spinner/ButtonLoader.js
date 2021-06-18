import React from "react";

function ButtonLoader() {
  return (
    <span>
      <i
        className="fa fa-circle-o-notch fa-spin"
        style={{ marginRight: "5px", paddingRight: "0" }}
      />
      Sending
    </span>
  );
}

export default ButtonLoader;
