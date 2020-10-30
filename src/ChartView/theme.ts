
export const theme = {
    CHART_RIGHT_WIDTH: 100 * 2,
    CHART_BOTTOM_HEIGHT: 32,
    CHART_边框颜色: 0xaaaaaa,
    CHART_上面加空隙: 40,
    CHART_下面加空隙: 5,

    //___//TODO
    showAll: (p: { length: number, maxCount?: number }) => ({
        left: Math.max(-0.5, (p.length - 0.5) - (p.maxCount === undefined ? 1000000 : p.maxCount)),
        right: p.length - 0.5,
    }),

   

}
