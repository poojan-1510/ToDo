import React from 'react';
import { Button } from '@mui/material';

const Task = ({ task, index, deleteTask }) => {
    console.log("Rendering task:", task); // Debugging
    return (
        <li
            style={{
                backgroundColor: task.importanceLevel === 0 ? '#d3f9d8' :
                    task.importanceLevel === 1 ? '#fff79c' : '#f5a9a9',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
            }}
        >
            {task.taskText}
            {!task.isDeleted && (
                <Button
                    onClick={() => deleteTask(index)}
                    style={{ float: "right" }}
                >
                    Delete
                </Button>
            )}
        </li>
    );
};

export default Task;
