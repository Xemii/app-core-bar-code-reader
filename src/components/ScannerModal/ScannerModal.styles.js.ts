import { createStyles, Theme } from "@material-ui/core";

export default ({ breakpoints }: Theme) => createStyles({
    root: {
        width: 960,
        minHeight: 240,
        [breakpoints.down('md')]: {
            width: `100%`,
            height: `100%`,
            margin: 0,
            maxWidth: `100%`,
            maxHeight: `none`,
            borderRadius: 0
        },
    },
    header: {
        display: 'flex',
        justifyContent: 'end',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0
    },
    scannerWrapper: {
        width: `100%`,
        overflow: 'hidden',
    },
    resultForm: {
        width: `100%`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
});