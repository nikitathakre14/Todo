import React, { useRef, useState } from 'react'
import './App.css'
export default function Inbox(props) {
    const [newTask, setNewTask] = useState(false)
    const titleRef = useRef()
    const calendarRef = useRef()
    const newTaskHandler = () => {
        setNewTask(true)
    }
    const addHandler = (e) => {
        e.preventDefault()
        if (titleRef.current.value === "") {
            window.alert("Task Can Not be empty");
            return;
        }
        const newObj = {
            number: props.list.length + 1,
            title: titleRef.current.value,
            date: new Date(calendarRef.current.value)
        }
        props.append(newObj)
        setNewTask(false)
    }
    const cancelHandler = () => {
        setNewTask(false)
    }
    return (
        <div>
            <h3>INBOX</h3>
            {!newTask && (
                <button className="new" onClick={newTaskHandler}>+Add New</button>
            )}
            {newTask && (
                <form className='newTask-box'>
                    <input className='input' type="text" ref={titleRef} />
                    <div className="buttons">
                        <button className='add' onClick={addHandler}>Add Task</button>
                        <button className="cancel" onClick={cancelHandler}>Cancel</button>
                        <input className='date' type="date" ref={calendarRef} />
                    </div>
                </form>
            )}
            <div>
                {props.list.map((list) => {
                    return (
                        <div className="box" key={list.number}>
                            {list.title} ({list.date.toLocaleDateString()})
                        </div>
                    )
                })}
            </div>
        </div>
    )
}