import { action, makeObservable, observable } from "mobx";

type SuccessCallback = (data: string) => void;
type ErrorCallback = (e: Error) => void;
type CancelCallback = () => void;
type LoadedCallback = (value: boolean) => void;

export interface BarCodeModalState {
    isOpened: boolean;
    isLoaded: boolean;
    handleSuccess: SuccessCallback | null;
    handleError: ErrorCallback | null;
    handleCancel: CancelCallback | null;
    handleLoaded: LoadedCallback;
}

export interface BarCodeModalController {
    open(successFn: SuccessCallback, errorFn: ErrorCallback, cancelFn: CancelCallback): void;
    close(): void;
}

export default class BarCodeModalStateImpl implements BarCodeModalState, BarCodeModalController {
    isOpened: boolean = false;
    isLoaded: boolean = false;
    handleSuccess: SuccessCallback | null = null;
    handleError: ErrorCallback | null = null;
    handleCancel: CancelCallback | null = null;

    constructor() {
        makeObservable(this, {
            isOpened: observable,
            isLoaded: observable,
            handleSuccess: observable,
            handleError: observable,
            handleCancel: observable,
            close: action,
            open: action,
            handleLoaded: action,
        })
    }

    close(): void {
        this.handleSuccess = null;
        this.handleError = null;
        this.handleCancel = null;
        this.isOpened = false;
    }

    open(successFn: SuccessCallback, errorFn: ErrorCallback, cancelFn: CancelCallback): void {
        this.handleSuccess = successFn;
        this.handleError = errorFn;
        this.handleCancel = cancelFn;
        this.isOpened = true;
    }

    handleLoaded(value: boolean) {
        this.isLoaded = value;
    }
}