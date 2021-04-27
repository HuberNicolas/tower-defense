/**
* Lobby model
*/
class Lobby {
  constructor(data = {}) {
    this.lobbyOwner = null;
    this.player2 = null;
    this.player2Status = null;
    Object.assign(this, data);
  }
}
export default Lobby;