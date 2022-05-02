import React, { ChangeEventHandler } from 'react';
import { observer } from "mobx-react";
import Quagga, { QuaggaJSResultCallbackFunction } from '@ericblade/quagga2';
import QuaggaCanvas from "../QuaggaCanvas/QuaggaCanvas";
import { createQuaggaDefaultConfig } from "../../utils/quagga";

type Props = {
    onSuccess: (text: string) => void,
    onError: (message: string) => void,
    onLoaded?: (value: boolean) => void,
}

const QUAGGA_ELEMENT_ID = 'bar-code-reader-file';

function FileScanner(props: Props) {
    const { onLoaded, onSuccess } = props;

    React.useEffect(() => {
        onLoaded && onLoaded(true);
    }, [onLoaded]);

    const handleSuccess: QuaggaJSResultCallbackFunction = React.useCallback((data) => {
        console.log(data);
        if (data.codeResult.code) {
            onSuccess(data.codeResult.code);
        }
    }, [onSuccess]);

    React.useEffect(() => {
        Quagga.onDetected(handleSuccess);
        return () => Quagga.offDetected(handleSuccess);
    }, [handleSuccess]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
        if (!e.target.files || !e.target.files.length) {
            return;
        }

        Quagga.decodeSingle({
            ...createQuaggaDefaultConfig(),
            inputStream: {
                singleChannel: false,
                target: `#${QUAGGA_ELEMENT_ID}`
            },
            src: URL.createObjectURL(e.target.files[0]),
        });
    }, [])

    return <div>
        <QuaggaCanvas id={QUAGGA_ELEMENT_ID} />
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange}/>
    </div>
}

export default observer(FileScanner);