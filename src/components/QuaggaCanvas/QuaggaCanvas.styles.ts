import { createStyles } from "@material-ui/core";

export default () => createStyles({
    root: {
        position: 'relative',
        '& > video': {
            width: `100%`,
            maxWidth: `100%`,
        },
        '& > canvas': {
            width: `100%`,
            maxWidth: `100%`,
            '&.drawing': {
                position: 'absolute',
                top: 0,
                left: 0
            },
            '&.drawingBuffer': {
                position: 'absolute',
                top: 0,
                left: 0
            }
        }

    }
})