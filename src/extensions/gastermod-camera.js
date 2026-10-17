import BlockType from 'scratch-vm/src/extension-support/block-type';
import ArgumentType from 'scratch-vm/src/extension-support/argument-type';
import Cast from 'scratch-vm/src/util/cast';
import {translateForCamera, translateScreenPos} from 'scratch-vm/src/util/pos-math';

const CAMERA_INFO = 'CAMERA_INFO';
const DEFAULT_CAMERA = 'default';

class GasterModCamera {
    constructor(runtime) {
        this.runtime = runtime;
        this.activeShakes = new Map();
        runtime.on('PROJECT_STOP_ALL', () => this.restoreShakes());
        runtime.on('RUNTIME_STEP_END', () => {
            for (const [thread, shake] of this.activeShakes) {
                if (!runtime.isActiveThread(thread)) {
                    this.restoreShake(shake);
                    this.activeShakes.delete(thread);
                }
            }
        });
    }

    getInfo() {
        return {
            id: 'gastermodCamera',
            name: 'Camera Tools',
            color1: '#FFFFFF',
            color2: '#CCCCCC',
            color3: '#999999',
            blocks: [
                {
                    opcode: 'shakeCamera',
                    blockType: BlockType.COMMAND,
                    text: 'shake camera for [DURATION] seconds with strength [STRENGTH]',
                    arguments: {
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 0.5},
                        STRENGTH: {type: ArgumentType.NUMBER, defaultValue: 10}
                    }
                },
                {
                    opcode: 'screenX',
                    blockType: BlockType.REPORTER,
                    text: 'screen x of world x [X] y [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'screenY',
                    blockType: BlockType.REPORTER,
                    text: 'screen y of world x [X] y [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'worldX',
                    blockType: BlockType.REPORTER,
                    text: 'world x at screen x [X] y [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'worldY',
                    blockType: BlockType.REPORTER,
                    text: 'world y at screen x [X] y [Y]',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                }
            ]
        };
    }

    getCameraId(target) {
        return target._customState[CAMERA_INFO] || target.cameraBound || DEFAULT_CAMERA;
    }

    screenPosition(args, util) {
        const camera = this.getCameraId(util.target);
        return translateForCamera(
            this.runtime,
            camera,
            Cast.toNumber(args.X),
            Cast.toNumber(args.Y)
        );
    }

    worldPosition(args, util) {
        const camera = this.getCameraId(util.target);
        return translateScreenPos(
            this.runtime,
            camera,
            Cast.toNumber(args.X),
            Cast.toNumber(args.Y)
        );
    }

    screenX(args, util) {
        return this.screenPosition(args, util)[0];
    }

    screenY(args, util) {
        return this.screenPosition(args, util)[1];
    }

    worldX(args, util) {
        return this.worldPosition(args, util)[0];
    }

    worldY(args, util) {
        return this.worldPosition(args, util)[1];
    }

    shakeCamera(args, util) {
        let shake = this.activeShakes.get(util.thread);
        if (!shake) {
            const cameraId = this.getCameraId(util.target);
            const camera = this.runtime.getCamera(cameraId);
            const duration = Math.max(0, Cast.toNumber(args.DURATION)) * 1000;
            shake = {
                cameraId,
                originalPosition: camera.pos.slice(),
                endTime: Date.now() + duration
            };
            this.activeShakes.set(util.thread, shake);
        }

        if (Date.now() >= shake.endTime) {
            this.runtime.updateCamera(shake.cameraId, {pos: shake.originalPosition.slice()});
            this.activeShakes.delete(util.thread);
            return;
        }

        const strength = Math.max(0, Cast.toNumber(args.STRENGTH));
        this.runtime.updateCamera(shake.cameraId, {
            pos: shake.originalPosition.map(position => {
                const offset = ((Math.random() * 2) - 1) * strength;
                return position + offset;
            })
        });
        util.yield();
    }

    restoreShakes() {
        for (const shake of this.activeShakes.values()) {
            this.restoreShake(shake);
        }
        this.activeShakes.clear();
    }

    restoreShake(shake) {
        this.runtime.updateCamera(shake.cameraId, {pos: shake.originalPosition.slice()});
    }
}

export default GasterModCamera;
