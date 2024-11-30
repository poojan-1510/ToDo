import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Task from './Task';
import './App.css';
import { TaskContractAddress } from './config.js';
import TaskAbi from './TaskContract.json';
const { ethers } = require("ethers");

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [importance, setImportance] = useState(0); // Default to Low importance
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Fetch tasks from the smart contract
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks.map((task) => ({
          taskText: task.taskText,
          importanceLevel: task.importanceLevel,
          isDeleted: task.isDeleted
        })));
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    if (currentAccount && correctNetwork) {
      getAllTasks();
    }
  }, [currentAccount, correctNetwork]);

  // Connect wallet to Ethereum
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Metamask not detected.');
        return;
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7'; // Sepolia Testnet
      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet.');
        return;
      } else {
        setCorrectNetwork(true);
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log('Error connecting to MetaMask.', error);
    }
  };

  // Add a task to the blockchain
  const addTask = async (event) => {
    event.preventDefault();
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        await TaskContract.addTask(input, importance);
        setInput('');
        setImportance(0); // Reset importance
        await getAllTasks(); // Refresh the task list after adding the task
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log("Error adding task: ", error);
    }
  };

  // Delete a task by index
  const deleteTask = async (index) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        await TaskContract.deleteTask(index);
        await getAllTasks(); // Refresh task list after deletion
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log("Error deleting task. ", error);
    }
  };

  return (
    <div>
      {currentAccount === '' ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            variant="contained" color="info"
            style={{ justifyContent: "center", margin: "50px", fontSize: "28px", fontWeight: "bold" }}
            onClick={connectWallet}
          >
            Connect 🦊 MetaMask Wallet ➡ Sepolia Testnet
          </Button>
        </div>
      ) : correctNetwork ? (
        <div className="App">
          <img src={require('./todo.png')} style={{ width: "40%", height: "30%" }} />
          <form style={{ margin: "20px 30px 20px" }}>
            <TextField
              id="outlined-basic"
              helperText="Enter a task then click the '+'"
              label="Task"
              style={{ margin: "0px 10px 30px" }}
              size="normal"
              value={input}
              onChange={event => setInput(event.target.value)}
            />
            <FormControl style={{ marginBottom: "20px" }}>
              <InputLabel>Importance</InputLabel>
              <Select value={importance} onChange={(e) => setImportance(e.target.value)}>
                <MenuItem value={0}>Low</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>High</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="info"
              style={{ fontSize: "28px", fontWeight: "bold" }}
              onClick={addTask}
            >
              +
            </Button>
          </form>
          <ul>
            {tasks.map((task, index) => (
              !task.isDeleted && (
                <Task key={index} task={task} index={index} deleteTask={deleteTask} />
              )
            ))}
          </ul>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
          <div>Connect to the Ethereum Sepolia Testnet and reload the page.</div>
        </div>
      )}
    </div>
  );
}

export default App;
