import * as Redux from "redux";
import Logger from "./middleware/logger.js";
import ReactDom from "react-dom";
import * as React from "react";
import reducer from "./reducers.js";
import * as actions from "./actionCreators.js";
class AppShell extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { sequence: [] };
        this.store = Redux.createStore(reducer, this.state, Redux.applyMiddleware(Logger));
        this.store.subscribe(() => {
            this.setState(this.store.getState())
        });
        this.startId = 210;
        this.onSwipeLeft = this.onSwipeLeft.bind(this);
        this.onSwipeRight = this.onSwipeRight.bind(this);
        this.onSwipeUp = this.onSwipeUp.bind(this);
    }
    get uId() {
        return `${this.startId++}`;
    }
    set uId(value) {
        return value;
    }
    onAddPlayer() {
        this.store.dispatch(actions.addPlayer(this.uId));
    }
    onSwipeRight(e) {
        let fromId = e.target.dataset.uid;
        let totalPlayers = this.state.sequence.length;
        let fromIdIndex = this.state.sequence.indexOf(fromId);

        let toIdIndex = ((fromIdIndex + 1) % totalPlayers);

        let toId = this.state.sequence[toIdIndex];
        this.store.dispatch(actions.swipeTo(fromId, toId));
    }
    onSwipeLeft(e) {
        let fromId = e.target.dataset.uid;
        let totalPlayers = this.state.sequence.length;
        let fromIdIndex = this.state.sequence.indexOf(fromId);

        let toIdIndex = fromIdIndex == 0 ? (totalPlayers - 1) : (fromIdIndex - 1);

        let toId = this.state.sequence[toIdIndex];
        this.store.dispatch(actions.swipeTo(fromId, toId));
    }
    onSwipeUp(){
    	this.store.dispatch(actions.swipeUp(this.state.sequence));	
    }
    render() {
        return <div>
        	<button onClick={::this.onAddPlayer}>ADD Player</button>
        	<h1>Sequence of Players with holders highlighted</h1>
        	<ul>{
        		this.state.sequence.map((uId,index)=>{        			
        			let isHolder = this.state.holders.list.indexOf(uId)!=-1;
        			let inlineStyle=isHolder?{color:"red"}:null;

        			return <li style={inlineStyle} key={uId}>
        							{this.state.players[uId].name}
        							{isHolder?<div>
	        							<button data-uid={uId} onClick={this.onSwipeLeft}>Swipe left</button>
	        							<button data-uid={uId} onClick={this.onSwipeRight}>Swipe Right</button>
	        							<button onClick={this.onSwipeUp}>Swipe Up</button>
        							</div>:null}
        						</li>
	        	})
        	}</ul>
        </div>;
    }
}

ReactDom.render(<AppShell />, document.getElementById("root"));
