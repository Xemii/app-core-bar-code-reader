import React from 'react';
import Button from "@material-ui/core/Button";
import ScannerModal from "./components/ScannerModal/ScannerModal";
import BarCodeService from "./services/BarCodeService";
import Typography from "@material-ui/core/Typography";

const service = new BarCodeService();

function App() {
    const [value, setValue] = React.useState('');

    const handleScan = React.useCallback(() => {
        setValue('');
        service.scanCode()
            .then((data) => {
                console.log(`Scanned ${data}`);
                setValue(data);
            })
            .catch((e) => {
                console.log(`Error ${e.message}`);
                setValue(`Error ${e.message}`);
            });
    }, []);

    return (
        <div>
            <Typography variant={'h6'}>Scanned value: {value}</Typography>
            <Button onClick={handleScan} variant={'contained'} size={'large'}>scan</Button>
            <ScannerModal state={service.state} />
        </div>
    );
}

export default App;