import React from "react";
import { Html5Qrcode } from 'html5-qrcode';
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/core";
import { Html5QrcodeSupportedFormats } from "html5-qrcode/esm/core";

type Props = {
    onSuccess: (text: string) => void,
    onError: (message: string) => void,
    onLoaded?: (value: boolean) => void,
}

function Scanner(props: Props) {
    const { onSuccess, onError, onLoaded } = props;

    React.useEffect(() => {
        if (!onSuccess) {
            return;
        }
        onLoaded && onLoaded(false);
        const handleSuccess: QrcodeSuccessCallback = (text, result) => onSuccess(text);
        const handleError: QrcodeErrorCallback = (message, error) => {
            error.type !== 0 && onError(message);
        }

        const scanner = new Html5Qrcode("code-reader", { verbose: true, formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39]});
        const start$ = scanner.start({
            facingMode: { exact: "user" },
        }, { fps: 10, qrbox: { width: 500, height: 500 } }, handleSuccess, handleError);
        start$.then(() => onLoaded && onLoaded(true))

        return () => {
            start$.then(() => {
                scanner.stop()
            });
        }
    }, [onLoaded]);

    return <div id={'code-reader'}/>
}

export default React.memo(Scanner);