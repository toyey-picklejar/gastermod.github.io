import {emptySprite} from '../../../src/lib/empty-assets';

describe('emptySprite', () => {
    test('includes the default sound', () => {
        const sprite = emptySprite('Sprite1', 'Weird Route Jingle', 'costume1');

        expect(sprite.sounds).toHaveLength(1);
        expect(sprite.sounds[0]).toMatchObject({
            soundName: 'Weird Route Jingle',
            md5: '3ba384b184fcd33076d7db843b3f3bc7.mp3',
            format: 'mpeg',
            rate: 44100,
            sampleCount: 140544
        });
    });
});
