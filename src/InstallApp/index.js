import React from 'react';
import PropTypes from 'prop-types';
import ContaiterBackGround from './components/ContaiterBackGround';
import logo from './img/logo.png';
import { ButtonBase } from '@material-ui/core';

function InstallApp(props) {
    return (
        <React.Fragment>
            {props.loading !== true
                ? (<ContaiterBackGround backgroundColor="#274D7D" height="100vh">
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
                            width: 200
                        }} alt="true" />
                        <h1 style={{ color: 'white' }}>Share We Go App</h1>
                        <ButtonBase
                            style={{
                                padding: '10px',
                                color: '#ffffff54',
                                borderRadius: '5px',
                                boxShadow: '0 3px 6px rgba(0, 0, 0, .16), 0 1px 2px rgba(0, 0, 0, .23)',
                            }}
                            onClick={props.onClick}>ติดตั้ง Share We Go Application</ButtonBase>
                    </div>
                </ContaiterBackGround>)
                : (<ContaiterBackGround backgroundColor="#274D7D" height="100vh">
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
                            width: 200
                        }} alt="true" />
                        <h1 style={{ color: 'white' }}>Share We Go App</h1>
                        <ButtonBase
                            style={{
                                padding: '10px',
                                color: '#ffffff54',
                                borderRadius: '5px',
                                boxShadow: '0 3px 6px rgba(0, 0, 0, .16), 0 1px 2px rgba(0, 0, 0, .23)',
                            }}
                        >กำลังติดตั้ง.....</ButtonBase>
                    </div>
                </ContaiterBackGround>)
            }
        </React.Fragment >
    )
}

InstallApp.propTypes = {
    onClick: PropTypes.func,
    loading: PropTypes.bool
}

export default InstallApp;