import React from 'react'
import './App.css'

export default function SideNav(props) {
    return (
        <ul className='side-nav' >
            <li className='inbox' onClick={() => { props.change("INBOX") }}>
                <div>INBOX</div>
            </li>
            <li className='today' onClick={() => { props.change("TODAY") }}>
                <div>TODAY</div>
            </li>
            <li className='next' onClick={() => { props.change("NEXT") }}>
                <div>NEXT 7 DAYS</div>
            </li>
        </ul>
    )
}
