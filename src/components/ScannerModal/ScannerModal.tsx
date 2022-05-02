import React from 'react';
import { observer } from "mobx-react";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import { BarCodeModalState } from "../../stores/BarCodeModalState";
import CameraScanner from "../CameraScanner/CameraScanner";
import styles from './ScannerModal.styles.js';
import { Button } from "@material-ui/core";
import FileScanner from "../FileScanner/FileScanner";

type Props = {
    state: BarCodeModalState
}

const useStyles = makeStyles(styles);

function ScannerModal(props: Props) {
    const { state } = props;
    const [result, setResult] = React.useState('');
    const [mode, setMode] = React.useState<'camera' | 'file'>('file');

    const classes = useStyles({});

    React.useEffect(() => {
        setResult('');
    }, [state, state.isOpened]);

    const handleClose = React.useCallback(() => {
        state.handleCancel && state.handleCancel();
    }, [state.handleCancel, state]);

    const handleScanResult = React.useCallback((data: string) => {
        setResult(data);
    }, []);

    const handleSuccess = React.useCallback(() => {
        state.handleSuccess && state.handleSuccess(result);
    }, [result, state, state.handleSuccess]);

    const handleError = React.useCallback((message: string) => {
        state.handleError && state.handleError(new Error(message));
    }, [state.handleError, state]);

    const handleLoad = React.useCallback((value: boolean) => {
        state.handleLoaded(value);
    }, [state.handleLoaded, state]);

    const handleSwitchMode = React.useCallback(() => {
        setMode(mode === 'camera' ? 'file' : 'camera');
    }, [mode]);

    return <Dialog open={state.isOpened}
                   onClose={handleClose}
                   classes={{paper: classes.root}}
    >
        <DialogTitle>
            <div className={classes.header}>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </div>
        </DialogTitle>
        <DialogContent classes={{root: classes.content}}>
            {!state.isLoaded && <CircularProgress />}
            {state.isOpened && mode === 'camera' && <div className={classes.scannerWrapper}>
                <CameraScanner onSuccess={handleScanResult} onError={handleError} onLoaded={handleLoad} />
            </div>}
            {state.isOpened && mode === 'file' && <div>
                <FileScanner onSuccess={handleScanResult} onError={handleError} onLoaded={handleLoad} />
            </div>}
            <div>
                <Button onClick={handleSwitchMode}>{ mode === 'camera' ? 'Файл' : 'Камера'}</Button>
                <div className={classes.resultForm}>
                    <div>{result || 'Штрих-код не распознан'}</div>
                    <Button disabled={!!result} onClick={handleSuccess}>OK</Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}

export default observer(ScannerModal);