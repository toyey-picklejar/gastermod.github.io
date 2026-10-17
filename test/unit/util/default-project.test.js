import defaultProjectGenerator from '../../../src/lib/default-project/index.js';

describe('defaultProject', () => {
    // This test ensures that the assets referenced in the default project JSON
    // do not get out of sync with the raw assets that are included alongside.
    // see https://github.com/LLK/scratch-gui/issues/4844
    test('assets referenced by the project are included', () => {
        const translatorFn = message => message.defaultMessage;
        const defaultProject = defaultProjectGenerator(translatorFn);
        const includedAssetIds = defaultProject.map(obj => obj.id);
        const projectData = JSON.parse(defaultProject[0].data);
        projectData.targets.forEach(target => {
            target.costumes.forEach(costume => {
                expect(includedAssetIds.includes(costume.assetId)).toBe(true);
            });
            target.sounds.forEach(sound => {
                expect(includedAssetIds.includes(sound.assetId)).toBe(true);
            });
        });

        const defaultSprite = projectData.targets.find(target => !target.isStage);
        expect(defaultSprite.sounds).toHaveLength(1);
        expect(defaultSprite.sounds[0].name).toBe('Weird Route Jingle');
        expect(defaultSprite.sounds[0].dataFormat).toBe('mp3');
    });
});
