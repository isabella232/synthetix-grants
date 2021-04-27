import { ChangeEvent, Dispatch, SetStateAction } from "react";

export const uppercase = ([first, ...rest]: string) =>
  [first.toUpperCase(), ...rest].join("");

export const useInput = (
  setState: Dispatch<SetStateAction<string>>,
  check?: (v: string) => boolean
) => (e: ChangeEvent<HTMLInputElement>) => {
  const v = e.target.value;
  if (check && !check(v)) return;
  setState(v);
};
