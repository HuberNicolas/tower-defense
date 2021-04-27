/**
* Lobby model
*/
class Lobby {
  constructor(data = {}) {
    this.lobbyId = null;
    this.owner = null;
    this.player2 = null;
    this.lobbyStatus = null;
    this.lobbyPassword = null;
    this.location = null;
    Object.assign(this, data);
  }
}
export default Lobby;