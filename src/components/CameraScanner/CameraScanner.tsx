import React from "react";
import Quagga, { QuaggaJSResultCallbackFunction } from '@ericblade/quagga2';
import QuaggaCanvas from "../QuaggaCanvas/QuaggaCanvas";
import { createQuaggaDefaultConfig } from "../../utils/quagga";

type Props = {
    onSuccess: (text: string) => void,
    onError: (message: string) => void,
    onLoaded?: (value: boolean) => void,
}

const QUAGGA_ELEMENT_ID = 'bar-code-reader-camera';

function CameraScanner(props: Props) {
    const { onSuccess, onError, onLoaded } = props;

    const handleSuccess: QuaggaJSResultCallbackFunction = React.useCallback((data) => {
        if (data.codeResult.code) {
            onSuccess(data.codeResult.code);
        }
    }, []);

    React.useEffect(() => {
        Quagga.onDetected(handleSuccess);
        return () => Quagga.offDetected(handleSuccess);
    }, [handleSuccess]);

    React.useEffect(() => {
        onLoaded && onLoaded(false);

        Quagga.init({
            ...createQuaggaDefaultConfig(),
            inputStream : {
                target: `#${QUAGGA_ELEMENT_ID}`,
                type : "LiveStream",
            },
            frequency: 30,
        }, (e: Error) => {
            if (e) {
                onError(e.message);
                return
            }
            onLoaded && onLoaded(true);
            Quagga.start();
        });

        return () => {
            Quagga.stop();
        }
    }, [onLoaded, onError, onSuccess]);


    return <QuaggaCanvas id={QUAGGA_ELEMENT_ID} />
}

export default React.memo(CameraScanner);