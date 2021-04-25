/**
* Lobby model
*/

class Lobby {
    constructor(data = {}){
    this.id = null;
        this.lobbyName = null;
        this.lobbyToken = null;
        this.lobbyStatus = null;
        this.lobbyPassword = null;
        Object.assign(this, data);
    }
}

export default Lobby;