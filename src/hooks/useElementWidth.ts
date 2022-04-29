import React from 'react';

export default (anchorEl: HTMLElement | null | undefined) => {
    const [width, setWidth] = React.useState(0);
    React.useEffect(() => {
        const resize = () => {
            if (anchorEl) {
                setWidth(anchorEl.offsetWidth);
            }
        }

        resize()
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    })

    return width;
}