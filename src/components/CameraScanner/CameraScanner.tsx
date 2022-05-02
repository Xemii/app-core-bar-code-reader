import React from "react";
import Quagga, { QuaggaJSResultCallbackFunction } from '@ericblade/quagga2';
import { makeStyles } from "@material-ui/core";
import styles from './CameraScanner.styles';

type Props = {
    onSuccess: (text: string) => void,
    onError: (message: string) => void,
    onLoaded?: (value: boolean) => void,
}

const useStyles = makeStyles(styles);

function CameraScanner(props: Props) {
    const { onSuccess, onError, onLoaded } = props;
    const classes = useStyles({});

    React.useEffect(() => {
        if (!onSuccess) {
            return;
        }
        onLoaded && onLoaded(false);

        Quagga.init({
            locate: true,
            inputStream : {
                target: "#bar-code-scanner",
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
            },
            frequency: 30,
            locator: {
                patchSize: "x-large",
                halfSample: true
            },
        }, (e: Error) => {
            if (e) {
                onError(e.message);
                return
            }
            onLoaded && onLoaded(true);
            Quagga.start();
        });

        const successHandler: QuaggaJSResultCallbackFunction = (data) => {
            if (data.codeResult.code) {
                onSuccess(data.codeResult.code);
            }
        }

        const processHandler: QuaggaJSResultCallbackFunction = (data) => {
            if (!data) {
                return;
            }

            const drawingCtx = Quagga.canvas.ctx.overlay;
            const drawingCanvas = Quagga.canvas.dom.overlay;

            if (data.boxes) {
                drawingCtx.clearRect(
                    0,
                    0,
                    parseInt(drawingCanvas.getAttribute("width") || '0'),
                    parseInt(drawingCanvas.getAttribute("height") || '0'));
                data.boxes.filter(function (box) {
                    return box !== data.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (data.box) {
                Quagga.ImageDebug.drawPath(data.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (data.codeResult && data.codeResult.code) {
                Quagga.ImageDebug.drawPath(data.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }

        }

        Quagga.onDetected(successHandler);
        Quagga.onProcessed(processHandler);

        return () => {
            Quagga.offDetected(successHandler);
            Quagga.offProcessed(processHandler);
            Quagga.stop();
        }
    }, [onLoaded, onError, onSuccess]);


    return <div id="bar-code-scanner" className={classes.root}/>
}

export default React.memo(CameraScanner);