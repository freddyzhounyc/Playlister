import { jsTPS_Transaction } from "jstps"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldSongIndex, initNewSongIndex, initPlaylistId) {
        super();
        this.store = initStore;
        this.oldSongIndex = initOldSongIndex;
        this.newSongIndex = initNewSongIndex;
        this.playlistId = initPlaylistId;
    }

    executeDo() {
        this.store.moveSong(this.oldSongIndex, this.newSongIndex, this.playlistId);
    }
    
    executeUndo() {
        this.store.moveSong(this.newSongIndex, this.oldSongIndex, this.playlistId);
    }
}