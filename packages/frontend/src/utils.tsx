export type ValueWithSetCallback<T> = {
    readonly value: T;
    callback: (newValue: T) => void
}