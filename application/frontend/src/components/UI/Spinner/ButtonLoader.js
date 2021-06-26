import React from "react";

function ButtonLoader() {
  return (
    <span>
      <i
        className="fa fa-circle-o-notch fa-spin"
        style={{
          marginRight: "5px",
          paddingRight: "0",
          color: "var(--color-neutral-100)",
        }}
      />
      Uploading
    </span>
  );
}

export default ButtonLoader;
