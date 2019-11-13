import React from 'react';
import CircularDeterminate from './components/CircularDeterminate';
import ContaiterBackGround from './components/ContaiterBackGround';
import logo from './img/logo.png';

function Loading() {
    return (
        <React.Fragment>
            <ContaiterBackGround backgroundColor="#274D7D" height="100vh">
                <div style={{
                    flex: 1,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#274D7D',
                    alignItems: 'center',
                }}>
                    <img src={logo} style={{
                        margin: 10,
                        width:200
                    }} alt="true"/>
                    <h1 style={{color: 'white'}}>Share We Go App</h1>
                    <CircularDeterminate></CircularDeterminate>
                </div>
            </ContaiterBackGround>
        </React.Fragment>
    )
}

export default Loading;