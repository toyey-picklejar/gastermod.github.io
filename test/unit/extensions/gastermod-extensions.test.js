jest.mock('scratch-vm/src/extension-support/block-type', () => ({
    COMMAND: 'command',
    HAT: 'hat',
    REPORTER: 'reporter'
}));

jest.mock('scratch-vm/src/extension-support/argument-type', () => ({
    BOOLEAN: 'Boolean',
    NUMBER: 'number',
    STRING: 'string'
}));

jest.mock('scratch-vm/src/util/cast', () => ({
    toBoolean: value => Boolean(value),
    toNumber: value => Number(value),
    toString: value => String(value)
}));

jest.mock('scratch-vm/src/util/pos-math', () => ({
    translateForCamera: (runtime, cameraId, x, y) => {
        const camera = runtime.getCamera(cameraId);
        return [(x - camera.pos[0]) * camera.scale, (y - camera.pos[1]) * camera.scale];
    },
    translateScreenPos: (runtime, cameraId, x, y) => {
        const camera = runtime.getCamera(cameraId);
        return [camera.pos[0] + (x / camera.scale), camera.pos[1] + (y / camera.scale)];
    }
}));

import GasterModCamera from '../../../src/extensions/gastermod-camera';
import GasterModSignals from '../../../src/extensions/gastermod-signals';
import GasterModTools from '../../../src/extensions/gastermod-tools';

describe('GasterMod Tools extension', () => {
    const tools = new GasterModTools();

    test('clamps values even when the limits are reversed', () => {
        expect(tools.clamp({VALUE: 12, MIN: 10, MAX: 0})).toBe(10);
    });

    test('maps an input range and handles a zero-width input range', () => {
        expect(tools.mapRange({
            VALUE: 5,
            IN_MIN: 0,
            IN_MAX: 10,
            OUT_MIN: 0,
            OUT_MAX: 100
        })).toBe(50);
        expect(tools.mapRange({
            VALUE: 5,
            IN_MIN: 1,
            IN_MAX: 1,
            OUT_MIN: 9,
            OUT_MAX: 10
        })).toBe(9);
    });

    test('interpolates within the endpoints and reports Scratch-style directions', () => {
        expect(tools.interpolate({START: 10, END: 20, AMOUNT: 0.5})).toBe(15);
        expect(tools.interpolate({START: 10, END: 20, AMOUNT: 2})).toBe(20);
        expect(tools.distance({X1: 0, Y1: 0, X2: 3, Y2: 4})).toBe(5);
        expect(tools.directionTo({X1: 0, Y1: 0, X2: 1, Y2: 0})).toBe(90);
    });
});

describe('GasterMod Signals extension', () => {
    test('makes each started signal thread read the signal value it received', () => {
        let hatsStarted;
        const runtime = {
            on: (eventName, callback) => {
                if (eventName === 'HATS_STARTED') hatsStarted = callback;
            }
        };
        const signals = new GasterModSignals(runtime);
        const thread = {};
        const util = {
            startHats: (opcode, fields) => hatsStarted(opcode, fields, null, [thread])
        };

        signals.sendSignal({SIGNAL: 'score', VALUE: '42'}, util);

        expect(signals.signalValue({}, {thread})).toBe('42');
    });
});

describe('GasterMod Camera Tools extension', () => {
    test('converts between world and screen coordinates for a camera state', () => {
        const camera = {pos: [10, 20], scale: 2, dir: 0};
        const runtime = {
            on: () => {},
            getCamera: () => camera
        };
        const extension = new GasterModCamera(runtime);
        const util = {
            target: {_customState: {}, cameraBound: 'default'}
        };
        const world = {X: 15, Y: 25};
        const screenX = extension.screenX(world, util);
        const screenY = extension.screenY(world, util);

        expect(screenX).toBe(10);
        expect(screenY).toBe(10);
        expect(extension.worldX({X: screenX, Y: screenY}, util)).toBe(15);
        expect(extension.worldY({X: screenX, Y: screenY}, util)).toBe(25);
    });
});
