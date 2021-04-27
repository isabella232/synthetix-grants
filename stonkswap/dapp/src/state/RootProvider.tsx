import React, { PropsWithChildren, createContext, useContext, useState } from "react";

interface Context {
  ref: HTMLDivElement | null;
}

const RootContext = createContext<Context | null>(null);

export const useRoot = () => useContext(RootContext);

const RootProvider = ({ children }: PropsWithChildren<{}>) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  return (
    <RootContext.Provider
      value={{
        ref,
      }}
    >
      {children}
      <div
        id="__portal"
        ref={(e) => {
          setRef(e);
        }}
      />
    </RootContext.Provider>
  );
};

export default RootProvider;
