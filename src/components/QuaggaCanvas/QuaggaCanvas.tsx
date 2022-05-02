import React from 'react';
import Quagga, { QuaggaJSResultCallbackFunction } from "@ericblade/quagga2";
import styles from './QuaggaScanner.styles';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(styles);

function QuaggaCanvas() {
    const classes = useStyles({});

    const handleProcess: QuaggaJSResultCallbackFunction = React.useCallback((data) => {
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
    }, []);

    React.useEffect(() => {
        Quagga.onProcessed(handleProcess);
        return () => Quagga.offProcessed(handleProcess);
    }, [handleProcess]);

    return <div id="bar-code-scanner" className={classes.root} />
}

export default QuaggaCanvas;