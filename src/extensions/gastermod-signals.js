import BlockType from 'scratch-vm/src/extension-support/block-type';
import ArgumentType from 'scratch-vm/src/extension-support/argument-type';
import Cast from 'scratch-vm/src/util/cast';

class GasterModSignals {
    constructor(runtime) {
        this.runtime = runtime;
        this.pendingSignal = null;
        this.threadValues = new WeakMap();

        runtime.on('HATS_STARTED', (opcode, matchFields, target, threads) => {
            if (opcode !== 'gastermodSignals_whenSignalReceived' || !this.pendingSignal) return;
            for (const thread of threads) {
                this.threadValues.set(thread, this.pendingSignal.value);
            }
        });
    }

    getInfo() {
        return {
            id: 'gastermodSignals',
            name: 'Signals',
            color1: '#FFFFFF',
            color2: '#CCCCCC',
            color3: '#999999',
            blocks: [
                {
                    opcode: 'sendSignal',
                    blockType: BlockType.COMMAND,
                    text: 'send signal [SIGNAL] with value [VALUE]',
                    arguments: {
                        SIGNAL: {type: ArgumentType.STRING, defaultValue: 'message'},
                        VALUE: {type: ArgumentType.STRING, defaultValue: ''}
                    }
                },
                {
                    opcode: 'whenSignalReceived',
                    blockType: BlockType.HAT,
                    text: 'when I receive signal [SIGNAL]',
                    arguments: {
                        SIGNAL: {type: ArgumentType.STRING, defaultValue: 'message'}
                    }
                },
                {
                    opcode: 'signalValue',
                    blockType: BlockType.REPORTER,
                    text: 'value of received signal'
                }
            ]
        };
    }

    getHats() {
        return {
            gastermodSignals_whenSignalReceived: {
                restartExistingThreads: true
            }
        };
    }

    sendSignal(args, util) {
        const signal = Cast.toString(args.SIGNAL);
        this.pendingSignal = {value: Cast.toString(args.VALUE)};
        try {
            util.startHats('gastermodSignals_whenSignalReceived', {SIGNAL: signal});
        } finally {
            this.pendingSignal = null;
        }
    }

    whenSignalReceived() {
        return true;
    }

    signalValue(args, util) {
        const value = this.threadValues.get(util.thread);
        return typeof value === 'undefined' ? '' : value;
    }
}

export default GasterModSignals;
