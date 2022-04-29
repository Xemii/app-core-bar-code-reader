import React from "react";
import Quagga, { QuaggaJSResultCallbackFunction } from '@ericblade/quagga2';
import './quagga.css';

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

        Quagga.init({
            locate: true,
            inputStream : {
                type : "LiveStream",
            },
            decoder : {
                readers : [
                    "code_93_reader",
                    "code_128_reader",
                    "code_39_reader",
                    "codabar_reader",
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_vin_reader",
                ]
            }
        }, (e: Error) => {
            if (e) {
                onError(e.message);
                return
            }
            onLoaded && onLoaded(true);
            Quagga.start();
        });

        const successHandler: QuaggaJSResultCallbackFunction = (data) => {
            console.log(data);
            if (data.codeResult.code) {
                onSuccess(data.codeResult.code);
            }
        }
        Quagga.onDetected(successHandler);

        return () => {
            Quagga.offDetected(successHandler);
            Quagga.stop();
        }
    }, [onLoaded, onError, onSuccess]);


    return <div id="interactive" className="viewport"/>
}

export default React.memo(Scanner);