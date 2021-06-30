import React from "react";

function ButtonLoader({ message }) {
  return (
    <span>
      <i
        className="fa fa-circle-o-notch fa-spin"
        style={{
          marginRight: "1rem",
          paddingRight: "0",
          color: "var(--color-neutral-100)",
        }}
      />
      {message}
    </span>
  );
}

export default ButtonLoader;
