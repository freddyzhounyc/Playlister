import { jsTPS_Transaction } from "jstps"

export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initSong, initPlaylistId) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.song = initSong;
        this.playlistId = initPlaylistId;
    }

    executeDo() {
        this.store.removeSong(this.index, this.song);
    }
    
    executeUndo() {
        this.store.createSong(this.index, this.song, this.playlistId);
    }
}