import React, { ChangeEventHandler } from 'react';
import { observer } from "mobx-react";
import Quagga, { QuaggaJSResultCallbackFunction } from '@ericblade/quagga2';
import { getResultDrawingCanvas } from "./utils";
import styles from './FileScanner.styles';
import { makeStyles } from "@material-ui/core";

type Props = {
    onSuccess: (text: string) => void,
    onError: (message: string) => void,
    onLoaded?: (value: boolean) => void,
}

const DRAWER_CONTAINER_ID = 'bar-code-reader-file';
const useStyles = makeStyles(styles);

function FileScanner(props: Props) {
    const { onLoaded, onSuccess, onError } = props;
    const classes = useStyles({});

    React.useEffect(() => {
        onLoaded && onLoaded(true);
    }, [onLoaded]);

    const handleSuccess: QuaggaJSResultCallbackFunction = React.useCallback((data) => {
        if (data.codeResult.code) {
            onSuccess(data.codeResult.code);
        }
    }, [onSuccess]);

    const handleProcess: QuaggaJSResultCallbackFunction = React.useCallback((data) => {
        if (!data) {
            return;
        }

        let drawingCanvas: HTMLCanvasElement | null = Quagga.canvas.dom.overlay;
        let drawingCtx: CanvasRenderingContext2D | null = Quagga.canvas.ctx.overlay;

        if (!drawingCtx || !drawingCanvas) {
            [drawingCanvas, drawingCtx] = getResultDrawingCanvas(DRAWER_CONTAINER_ID);
        }
        if (!drawingCtx || !drawingCanvas) {
            return;
        }

        if (data.boxes) {
            drawingCtx.clearRect(
                0,
                0,
                parseInt(drawingCanvas.getAttribute("width") || '0'),
                parseInt(drawingCanvas.getAttribute("height") || '0'));
            data.boxes.filter(function (box) {
                return box !== data.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx as CanvasRenderingContext2D, { color: "green", lineWidth: 2 });
            });
        }

        if (data.box) {
            Quagga.ImageDebug.drawPath(data.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

        if (data.codeResult && data.codeResult.code) {
            Quagga.ImageDebug.drawPath(data.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
    }, []);

    React.useEffect(() => {
        Quagga.onProcessed(handleProcess);
        return () => Quagga.offProcessed(handleProcess);
    }, [handleProcess]);

    React.useEffect(() => {
        Quagga.onDetected(handleSuccess);
        return () => Quagga.offDetected(handleSuccess);
    }, [handleSuccess]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
        if (!e.target.files || !e.target.files.length) {
            return;
        }

        Quagga.decodeSingle({
            inputStream: {
                singleChannel: false,
                target: `#${DRAWER_CONTAINER_ID}`
            },
            locator: {
                patchSize: "large",
                halfSample: true
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
            locate: true,
            src: URL.createObjectURL(e.target.files[0]),
        });
    }, [])

    return <div>
        <div id={DRAWER_CONTAINER_ID} className={classes.root} />
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange}/>
    </div>
}

export default observer(FileScanner);