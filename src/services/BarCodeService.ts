import BarCodeModalStateImpl from "../stores/BarCodeModalState";

export default class BarCodeService {
    state: BarCodeModalStateImpl = new BarCodeModalStateImpl();

    scanCode(): Promise<string> {
        if (this.state.handleCancel) {
            this.state.handleCancel();
            this.state.close();
        }

        return new Promise((resolve, reject) => {
           this.state.open(
               (data) => {
                   this.state.close();
                   resolve(data)
               },
               (e) => {
                   this.state.close();
                   reject(e);
               },
               () => {
                   this.state.close();
                   reject(new Error('CANCELED'));
               }
           )
        });
    }
}
