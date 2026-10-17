import VM from 'scratch-vm';
import storage from '../lib/storage';
import GasterModCamera from '../extensions/gastermod-camera';
import GasterModSignals from '../extensions/gastermod-signals';
import GasterModTools from '../extensions/gastermod-tools';
import {MAXIMUM_CLOUD_VARIABLES} from '../lib/tw-cloud-limits';

const SET_VM = 'scratch-gui/vm/SET_VM';
const defaultVM = new VM();
defaultVM.setCompatibilityMode(true);
defaultVM.extensionManager.workerMode = 'iframe';
defaultVM.extensionManager.addBuiltinExtension('gastermodTools', GasterModTools);
defaultVM.extensionManager.addBuiltinExtension('gastermodSignals', GasterModSignals);
defaultVM.extensionManager.addBuiltinExtension('gastermodCamera', GasterModCamera);
defaultVM.runtime.cloudOptions.limit = MAXIMUM_CLOUD_VARIABLES;
defaultVM.attachStorage(storage);
const initialState = defaultVM;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_VM:
        return action.vm;
    default:
        return state;
    }
};
const setVM = function (vm) {
    return {
        type: SET_VM,
        vm: vm
    };
};

export {
    reducer as default,
    initialState as vmInitialState,
    setVM
};
