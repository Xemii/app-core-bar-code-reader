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
import Scanner from "../Scanner/Scanner";
import styles from './ScannerModal.styles.js';

type Props = {
    state: BarCodeModalState
}

const useStyles = makeStyles(styles);

function ScannerModal(props: Props) {
    const { state } = props;

    const classes = useStyles({});

    const handleClose = React.useCallback(() => {
        state.handleCancel && state.handleCancel();
    }, [state.handleCancel, state]);

    const handleSuccess = React.useCallback((data: string) => {
        state.handleSuccess && state.handleSuccess(data);
    }, [state.handleSuccess, state]);

    const handleError = React.useCallback((message: string) => {
        state.handleError && state.handleError(new Error(message));
    }, [state.handleError, state]);

    const handleLoad = React.useCallback((value: boolean) => {
        state.handleLoaded(value);
    }, [state.handleLoaded, state]);

    return state.isOpened ? <Scanner onSuccess={handleSuccess} onError={handleError} onLoaded={handleLoad} /> : <div/>
    /*return <Dialog open={state.isOpened}
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
        <DialogContent>
            {!state.isLoaded && <CircularProgress />}
            {state.isOpened && <div>
                <Scanner onSuccess={handleSuccess} onError={handleError} onLoaded={handleLoad} />
            </div>}
        </DialogContent>
    </Dialog>*/
}

export default observer(ScannerModal);