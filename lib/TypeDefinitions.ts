export type MatrixValue = Record<`${number}_${number}`, string | undefined>;
export type ChangeEventHandler = (value: string) => void;
