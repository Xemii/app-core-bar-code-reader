import React from 'react';
import { makeStyles } from "@material-ui/core";
import Quagga, { QuaggaJSResultCallbackFunction } from '../../lib/quagga';
import { getResultDrawingCanvas } from "./utils";
import styles from './QuaggaCanvas.styles';

const useStyles = makeStyles(styles);

type Props = {
    id: string
}

function QuaggaCanvas(props: Props) {
    const { id } = props;
    const classes = useStyles({});

    const handleProcess: QuaggaJSResultCallbackFunction = React.useCallback((data) => {
        if (!data) {
            return;
        }

        let drawingCanvas: HTMLCanvasElement | null = Quagga.canvas.dom.overlay;
        let drawingCtx: CanvasRenderingContext2D | null = Quagga.canvas.ctx.overlay;

        if (!drawingCtx || !drawingCanvas) {
            [drawingCanvas, drawingCtx] = getResultDrawingCanvas(id);
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
    }, [id]);

    React.useEffect(() => {
        Quagga.onProcessed(handleProcess);
        return () => Quagga.offProcessed(handleProcess);
    }, [handleProcess]);

    return <div id={id} className={classes.root} />
}

export default QuaggaCanvas;