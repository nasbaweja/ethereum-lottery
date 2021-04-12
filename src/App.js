import logo from './logo.svg';
import './App.css';
import web3 from "./web3";
import { Component } from 'react';
import lottery from "./Lottery";

export default class App extends Component{

  constructor(props){
    super(props);
    this.state = {manager: '', players: [], balance: '', value: 0};
  }
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager : manager, players: players, balance: balance, message:''});
  }

  onSubmit = async (event) =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: "Waiting for transaction to complete..."})

    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(this.state.value, "ether")
    })

    this.setState({message: "You have been entered..."})

  }

  onClick = async () =>{
    // event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message: "Waiting for transaction to complete..."})
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    })
    this.setState({message: "Winner Declared..."})
  }

  render(){
    // web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>The number of people who have enetered the lottery are: {this.state.players.length}</p>
        <p>The total amount is: {web3.utils.fromWei(this.state.balance, 'ether')} ether</p>
      <hr></hr>
        <form onSubmit={this.onSubmit}>
          <h4>Want to enter?</h4>
          <p>Enter the amount</p>
          <input onChange={event => this.setState({value: event.target.value})} value={this.state.value}></input>
          <button>Enter</button>
        </form>
        
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick A Winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
