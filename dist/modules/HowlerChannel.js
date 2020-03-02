import { Howl, Howler } from "howler";
export default class HowlerChannel {
    constructor(options = {}) {
        const { fade = false, duration = 2000, volume = false } = options;
        this.sounds = [];
        this.volume = volume || Howler.volume();
        this.fade = fade;
        this.duration = duration;
        return this;
    }
    get(key = false) {
        return key ? this.sounds.find(i => i.key === key) : this.sounds;
    }
    getPlaying() {
        return this.sounds.filter(i => i.playing);
    }
    getNotPlaying() {
        return this.sounds.filter(i => !i.playing);
    }
    addSound(soundData) {
        const sound = Object.assign({}, soundData);
        if (this.get(sound.key))
            return;
        const howl = new Howl(Object.assign(Object.assign({}, soundData), { onplayerror() {
                if (soundData.autoplay)
                    howl.once("unlock", () => howl.play());
            }, onplay: () => (this.get(sound.key).playing = true), onend: () => (this.get(sound.key).playing = false), onstop: () => (this.get(sound.key).playing = false), onfade: () => howl.volume() === 0 && howl.stop() }));
        this.sounds.push(Object.assign(Object.assign({}, sound), { howl }));
        return this;
    }
    addSounds(soundList) {
        soundList.map(t => this.addSound(t));
        return this;
    }
    volume(num) {
        this.volume = num;
        this.sounds.map(i => {
            i.volume = num;
            return i.howl.volume(num);
        });
    }
    play(key, options = {}) {
        const { fade = false, duration = 2000 } = options;
        if (!key)
            return;
        const sound = this.get(key);
        const { howl } = sound;
        if (!sound || !howl || sound.playing)
            return;
        if (!fade)
            return howl.play();
        const volume = sound.volume || this.volume;
        return howl.fade(0, volume, duration).play();
    }
    stop(key = false, options = {}) {
        const { fade = this.fade, duration = this.duration } = options;
        if (!key)
            return;
        const sound = this.get(key);
        const { howl } = sound;
        if (!sound || !howl || !sound.playing)
            return;
        if (!fade)
            return howl.stop();
        return howl.fade(sound.howl.volume(), 0, duration);
    }
    switch(keys = {}, options = {}) {
        const { from = false, to = false } = keys;
        const { fade = this.fade, duration = this.duration } = options;
        let fromSounds = this.getPlaying();
        let toSounds = this.getNotPlaying();
        if (from)
            fromSounds = this.sounds.filter(i => from.includes(i.key));
        if (to)
            toSounds = this.sounds.filter(i => from.includes(i.key));
        this.stopAll({ fade, duration }, fromSounds);
        this.playAll({ fade, duration }, toSounds);
    }
    stopAll(options = {}, sounds = this.sounds) {
        const { fade = this.fade, duration = this.duration } = options;
        sounds.map(i => this.stop(i.key, { fade, duration }));
    }
    playAll(options = {}, sounds = this.sounds) {
        const { fade = this.fade, duration = this.duration } = options;
        sounds.map(i => this.play(i.key, { fade, duration }));
    }
}
