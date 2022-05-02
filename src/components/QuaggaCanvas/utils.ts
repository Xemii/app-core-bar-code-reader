export const getResultDrawingCanvas: (id: string) => [HTMLCanvasElement | null, CanvasRenderingContext2D | null] = (id) => {
    const parent = document.getElementById(id);
    if (!parent) {
        return [null, null];
    }
    const canvas = parent.getElementsByClassName('drawingBuffer')[0] as HTMLCanvasElement;
    if (!canvas) {
        return [null, null];
    }
    return [
        canvas,
        canvas.getContext('2d')
    ]
}