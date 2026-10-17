import BlockType from 'scratch-vm/src/extension-support/block-type';
import ArgumentType from 'scratch-vm/src/extension-support/argument-type';
import Cast from 'scratch-vm/src/util/cast';

class GasterModTools {
    constructor() {
        this.timerStarts = new WeakMap();
    }

    getInfo() {
        return {
            id: 'gastermodTools',
            name: 'GasterMod Tools',
            color1: '#FFFFFF',
            color2: '#CCCCCC',
            color3: '#999999',
            blocks: [
                {
                    opcode: 'clamp',
                    blockType: BlockType.REPORTER,
                    text: 'clamp [VALUE] between [MIN] and [MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5},
                        MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 10}
                    }
                },
                {
                    opcode: 'mapRange',
                    blockType: BlockType.REPORTER,
                    text: 'map [VALUE] from [IN_MIN] to [IN_MAX] into [OUT_MIN] to [OUT_MAX]',
                    arguments: {
                        VALUE: {type: ArgumentType.NUMBER, defaultValue: 5},
                        IN_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        IN_MAX: {type: ArgumentType.NUMBER, defaultValue: 10},
                        OUT_MIN: {type: ArgumentType.NUMBER, defaultValue: 0},
                        OUT_MAX: {type: ArgumentType.NUMBER, defaultValue: 100}
                    }
                },
                {
                    opcode: 'interpolate',
                    blockType: BlockType.REPORTER,
                    text: 'interpolate from [START] to [END] by [AMOUNT]',
                    arguments: {
                        START: {type: ArgumentType.NUMBER, defaultValue: 0},
                        END: {type: ArgumentType.NUMBER, defaultValue: 100},
                        AMOUNT: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    }
                },
                {
                    opcode: 'distance',
                    blockType: BlockType.REPORTER,
                    text: 'distance from x [X1] y [Y1] to x [X2] y [Y2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 100}
                    }
                },
                {
                    opcode: 'directionTo',
                    blockType: BlockType.REPORTER,
                    text: 'direction from x [X1] y [Y1] to x [X2] y [Y2]',
                    arguments: {
                        X1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y1: {type: ArgumentType.NUMBER, defaultValue: 0},
                        X2: {type: ArgumentType.NUMBER, defaultValue: 100},
                        Y2: {type: ArgumentType.NUMBER, defaultValue: 100}
                    }
                },
                {
                    opcode: 'resetElapsedTimer',
                    blockType: BlockType.COMMAND,
                    text: 'reset elapsed timer for this sprite'
                },
                {
                    opcode: 'elapsedTime',
                    blockType: BlockType.REPORTER,
                    text: 'seconds since elapsed timer reset'
                },
                {
                    opcode: 'logValue',
                    blockType: BlockType.COMMAND,
                    text: 'log [VALUE] to developer console',
                    arguments: {
                        VALUE: {type: ArgumentType.STRING, defaultValue: 'debug value'}
                    }
                },
                {
                    opcode: 'assertCondition',
                    blockType: BlockType.COMMAND,
                    text: 'assert [CONDITION] with message [MESSAGE]',
                    arguments: {
                        CONDITION: {type: ArgumentType.BOOLEAN},
                        MESSAGE: {type: ArgumentType.STRING, defaultValue: 'Assertion failed'}
                    }
                }
            ]
        };
    }

    clamp(args) {
        const value = Cast.toNumber(args.VALUE);
        const min = Cast.toNumber(args.MIN);
        const max = Cast.toNumber(args.MAX);
        return Math.max(Math.min(min, max), Math.min(Math.max(min, max), value));
    }

    mapRange(args) {
        const value = Cast.toNumber(args.VALUE);
        const inMin = Cast.toNumber(args.IN_MIN);
        const inMax = Cast.toNumber(args.IN_MAX);
        const outMin = Cast.toNumber(args.OUT_MIN);
        const outMax = Cast.toNumber(args.OUT_MAX);
        if (inMin === inMax) return outMin;
        const ratio = (value - inMin) / (inMax - inMin);
        const mappedValue = ratio * (outMax - outMin);
        return outMin + mappedValue;
    }

    interpolate(args) {
        const start = Cast.toNumber(args.START);
        const end = Cast.toNumber(args.END);
        const amount = Math.max(0, Math.min(1, Cast.toNumber(args.AMOUNT)));
        const delta = end - start;
        const interpolatedDelta = delta * amount;
        return start + interpolatedDelta;
    }

    distance(args) {
        return Math.hypot(
            Cast.toNumber(args.X2) - Cast.toNumber(args.X1),
            Cast.toNumber(args.Y2) - Cast.toNumber(args.Y1)
        );
    }

    directionTo(args) {
        const deltaX = Cast.toNumber(args.X2) - Cast.toNumber(args.X1);
        const deltaY = Cast.toNumber(args.Y2) - Cast.toNumber(args.Y1);
        const direction = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
        return (direction + 360) % 360;
    }

    resetElapsedTimer(args, util) {
        this.timerStarts.set(util.target, Date.now());
    }

    elapsedTime(args, util) {
        if (!this.timerStarts.has(util.target)) {
            this.resetElapsedTimer(args, util);
        }
        return (Date.now() - this.timerStarts.get(util.target)) / 1000;
    }

    logValue(args) {
        // eslint-disable-next-line no-console
        console.log(Cast.toString(args.VALUE));
    }

    assertCondition(args) {
        if (!Cast.toBoolean(args.CONDITION)) {
            // eslint-disable-next-line no-console
            console.error(`GasterMod assertion failed: ${Cast.toString(args.MESSAGE)}`);
        }
    }
}

export default GasterModTools;
