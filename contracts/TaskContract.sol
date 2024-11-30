// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract TaskContract {
    uint public unlockTime;
    address payable public owner;

    enum Importance { Low, Medium, High }

    struct Task {
        string taskText;
        bool isDeleted;
        Importance importanceLevel;
    }

    Task[] public tasks;
    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function addTask(string memory taskText, uint importanceLevel) public {
        require(importanceLevel <= uint(Importance.High), "Invalid importance level");
        tasks.push(Task(taskText, false, Importance(importanceLevel)));
    }

    function deleteTask(uint taskId) public {
        require(taskId < tasks.length, "Invalid task ID");
        tasks[taskId].isDeleted = true;
    }

    // Helper function to return a task by index
    function getTask(uint taskId) public view returns (string memory taskText, bool isDeleted, Importance importanceLevel) {
        require(taskId < tasks.length, "Task does not exist");
        Task storage task = tasks[taskId];
        return (task.taskText, task.isDeleted, task.importanceLevel);
    }

    function getMyTasks() public view returns (string[] memory taskTexts, bool[] memory isDeletedFlags, Importance[] memory importanceLevels) {
        uint taskCount = tasks.length;
        taskTexts = new string[](taskCount);
        isDeletedFlags = new bool[](taskCount);
        importanceLevels = new Importance[](taskCount);
        
        for (uint i = 0; i < taskCount; i++) {
            Task storage task = tasks[i];
            taskTexts[i] = task.taskText;
            isDeletedFlags[i] = task.isDeleted;
            importanceLevels[i] = task.importanceLevel;
        }
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");
        
        uint balance = address(this).balance;
        emit Withdrawal(balance, block.timestamp);

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
}
