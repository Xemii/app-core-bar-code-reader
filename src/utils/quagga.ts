export const createQuaggaDefaultConfig = () => ({
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
})