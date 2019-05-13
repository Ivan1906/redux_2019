import React from 'react';
import './App.css';

function createStore(reducer, initiaState) {
  return {
    _state: initiaState,
    _reducer: reducer,
    _listeners: [],

    dispatch(action) {
      const nextState = this._reducer(this._state, action);
      this._state = nextState;
      this._triggerListeners();
    },

    getState() {
      return this._state;
    },

    subscribe(callback) {
      const listener = {
        id: new Date().getTime(),
        callback
      };
      //unsibscribe
      return () => {
        this._listeners = this
          ._listeners
          .filter(i => i.id !== listener.id);
      };
    },

    _triggerListeners() {
      this
        ._listeners
        .forEach(listener => {
          listener.callback();
        });
    }
  }
};

function reducer(prevState, action) {
  if (action.type === 'PING') {
    return 'PONG';
  };

  return prevState;
};

const store = createStore(reducer, "PING");

const ReduxContex = React.createContext(null);

const {Provider: ContextProvider, Consumer} = ReduxContex;

function Provider(props) {
  return (
    <ContextProvider value={this.props.store}>
      {this.props.children}
    </ContextProvider>
  );
};

function connect(mapStateToProps, mapDispatchToProps) {
  return (Component) => {
    class Connect extends React.Component {
      constructor(props) {
        super(props);

        this.state = mapStateToProps(store.getState(), this.props);
      };

      componentDidMount() {
        this._disposer = store.subscribe(() => {
          const state = store.getState();
        });
      };

      render() {
        return (<Component {...this.state} {...this.props}/>);
      }
    };

    return Connect;
  };
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Program work!</h1>
      </header>
    </div>
  );
}

export default App;
