import { sprites } from './sprites';
const getColors = (variant, theme) => {
    const { iconBgCommon, iconBgSelected, iconFgCommon, iconFgSelected } = theme;
    return variant === 'selected' ? [iconFgSelected, iconBgSelected] : [iconFgCommon, iconBgCommon];
};
export class SpriteManager {
    onSettled;
    spriteMap = new Map();
    icons;
    inFlight = 0;
    constructor(icons, onSettled) {
        this.onSettled = onSettled;
        this.icons = {
            ...sprites,
            ...icons,
        };
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    drawSprite(ctx, props) {
        const { sprite, variant = 'normal', x, y, size, alpha = 1, theme, colors } = props;
        const [fgColor, bgColor] = colors ?? getColors(variant, theme);
        const rSize = size * Math.ceil(window.devicePixelRatio);
        const key = `${bgColor}_${fgColor}_${rSize}_${sprite}`;
        let spriteCanvas = this.spriteMap.get(key);
        if (spriteCanvas === undefined) {
            const spriteCb = this.icons[sprite];
            if (spriteCb === undefined)
                return;
            spriteCanvas = document.createElement('canvas');
            const spriteCtx = spriteCanvas.getContext('2d');
            if (spriteCtx === null)
                return;
            const imgSource = new Image();
            imgSource.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(spriteCb({ fgColor, bgColor }))}`;
            this.spriteMap.set(key, spriteCanvas);
            const promise = imgSource.decode();
            if (promise === undefined)
                return;
            this.inFlight++;
            promise
                .then(() => {
                spriteCtx.drawImage(imgSource, 0, 0, rSize, rSize);
            })
                .finally(() => {
                this.inFlight--;
                if (this.inFlight === 0) {
                    this.onSettled?.();
                }
            });
        }
        else {
            if (alpha < 1) {
                ctx.globalAlpha = alpha;
            }
            ctx.drawImage(spriteCanvas, 0, 0, rSize, rSize, x, y, size, size);
            if (alpha < 1) {
                ctx.globalAlpha = 1;
            }
        }
    }
}
