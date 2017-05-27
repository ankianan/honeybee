import { batchActions } from 'redux-batched-actions';
export default class MeshPeer {
    constructor(props) {
        this.peer = new Peer(props.peerConfig);
        this.state = {
            connMap: {}
        };
        this.peer.on("open", ::this.onOpen);
        this.peer.on("error", ::this.onError);
        this.peer.on("connection", ::this.onConnection);
        this.peer.on("data", ::this.onData);
    }
    connect(destPeerId) {
        /**
         * Add dest peer to players
         */
        this.props.dispatch(this.props.addPlayer({
            uId: destPeerId,
            status: "toBeConnected"
        }))
    }
    connectMultuple(destPeerIdList) {
        /**
         * Add dest peers to players
         */
        this.props.dispatch(batchActions(destPeerIdList.map(destPeerId => {
            uId: destPeerId,
            status: "toBeConnected"
        })));
    }
    onOpen(peerId) {
        /**
         * Add self to players
         */
        this.props.dispatch(this.props.addPlayer({
            uId: peerId,
            status: "connected"
        }));
    }
    onConnection(conn) {
        this.connMap[conn.peerId] = conn;
        /**
         * Add remote peer to players
         */
        this.props.dispatch(this.props.addPlayer({
            uId: conn.peerId,
            metadata: conn.metadata
            status: "toBeNotified"
        }));

    }
    onData(data) {
        switch (data.type) {
            case "PEER_CONNECT_TO":
                return this.connectMultuple(data.payload.list);
            default:
                return;
        }
    }
    onError() {
        /**
         * On unable to connect, remove dest peer from players
         */
    }
    connectOnStoreUpdate(nextProps) {
        let playerIdList = Object.keys(nextProps.players);

        nextProps.players.filter((player) => {
            return player.status == "toBeConnected"
        }).forEach((player) => {
            this.connMap[player.uId] = this.peer.connect(player.uId, {
                metaData: {
                    playerIdList
                }
            });
            setTimeout(() => {
                nextProps.updatePlayerState({
                    uId: player.uId,
                    status: "connected"
                })
            }, 0);
        });
    }
    notifyOnStoreUpdate(nextProps) {
        let playerIdList = Object.keys(nextProps.players);
        nextProps.players.filter((player) => {
            return player.status == "toBeNotified"
        }).forEach((player) => {

            let unknownPeers = playerIdList.filter(playerId => player.metadata.playerIdList.indexOf(playerId) == -1);
            if (unknownPeers.length) {
                this.connMap[player.uId].send({
                    type: "PEER_CONNECT_TO",
                    payload: {
                        list: unknownPeers
                    }
                })
            }

            setTimeout(() => {
                nextProps.updatePlayerState({
                    uId: player.uId,
                    status: "notified"
                })
            }, 0)
        });
    }
    shouldComponentUpdate() {
        for (key in nextProps) {
            if (nextProps[key] ! = this.props.key) {
                return true
            }
        }
        return false;
    }
    onStoreUpdate(nextProps) {
        if (this.shouldComponentUpdate()) {
            this.connectOnStoreUpdate(nextProps);
            this.notifyOnStoreUpdate(nextProps);
            this.props = nextProps;
        }
    }
}

/**
 *      Open
 * A :  {A}
 * B :  {B}
 * R :  {R}
 *
 *      Open
 * A :  {A}
 * B :  {B}
 * R :  {R}
 */
