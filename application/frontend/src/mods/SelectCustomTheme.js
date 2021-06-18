import React from "react";

function SelectCustomTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "#24949a",
      primary: "#24949a",
    },
  };
}

export default SelectCustomTheme;
