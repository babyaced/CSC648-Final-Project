import React, { useState } from "react";

export const RedirectPathContext = React.createContext({
  loading: false,
  redirectPath: "/Feed",
  redirectTo: () => {},
  updateLoading: () => {},
});

function RedirectPathContextProvider(props) {
  const [path, setPath] = useState("/Feed");
  const [loading, setLoading] = useState(false);

  function redirectHandler(newPath) {
    setPath(newPath);
  }

  // accept true or false
  function updateLoadingHandler(val) {
    setLoading(val);
  }

  return (
    <RedirectPathContext.Provider
      value={{
        redirectPath: path,
        redirectTo: redirectHandler,
        loading: loading,
        updateLoading: updateLoadingHandler,
      }}
    >
      {props.children}
    </RedirectPathContext.Provider>
  );
}

export default RedirectPathContextProvider;
