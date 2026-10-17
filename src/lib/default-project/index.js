import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import overrideDefaultProject from '!arraybuffer-loader!./default-project.sb3';
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!arraybuffer-loader!../../../static/images/gaster.png';
import weirdRouteJingle from '!arraybuffer-loader!../../../static/images/weird-route-jingle.mp3';
/* eslint-enable import/no-unresolved */
import {TextEncoder} from '../tw-text-encoder';
import DEFAULT_SOUND from '../default-sound';

const defaultProject = translator => {
    if (overrideDefaultProject.byteLength > 0) {
        return [{
            id: 0,
            assetType: 'Project',
            dataFormat: 'JSON',
            data: overrideDefaultProject
        }, {
            id: DEFAULT_SOUND.assetId,
            assetType: 'Sound',
            dataFormat: 'MP3',
            data: weirdRouteJingle
        }];
    }

    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();
    const projectJson = projectData(translator);
    return [{
        id: 0,
        assetType: 'Project',
        dataFormat: 'JSON',
        data: JSON.stringify(projectJson)
    }, {
        id: 'cd21514d0531fdffb22204e0ec5ed84a',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(backdrop)
    }, {
        id: 'e7ed8979662661ed09ac8021ab34e040',
        assetType: 'ImageBitmap',
        dataFormat: 'PNG',
        data: costume1
    }, {
        id: DEFAULT_SOUND.assetId,
        assetType: 'Sound',
        dataFormat: 'MP3',
        data: weirdRouteJingle
    }];
};
export default defaultProject;
