type MeasureFunction = (v: number) => string;

export const px: MeasureFunction = (v) => `${v}px`;
export const rem: MeasureFunction = (v) => `${v}rem`;
export const percent: MeasureFunction = (v) => `${v}%`;

export type Size = "small" | "medium" | "large";

export type SizeMap = Map<Size, number | string>;

export interface SizeProps {
  small?: boolean;
  medium?: boolean;
  large?: boolean;
}

export const sizeNoMap = (def: Size, ...sizes: number[] | string[]) =>
  sizeMap(def, undefined, ...sizes);

export const sizeMap = (
  def: Size,
  mapper?: (v: number) => string,
  ...sizes: number[] | string[]
) => {
  const map = new Map<Size, number | string>([
    ["small", sizes[0]],
    ["medium", sizes[1]],
    ["large", sizes[2]],
  ]);

  const getter = getSize(map, def, mapper);

  return getter;
};

const getSize = <T extends SizeProps>(
  map: SizeMap,
  def: Size,
  mapper?: (v: number) => string
) => (props: T) => {
  const value =
    map.get(
      props.small ? "small" : props.medium ? "medium" : props.large ? "large" : def
    ) || 0;
  return mapper && typeof value === "number" ? mapper(value) : value;
};
