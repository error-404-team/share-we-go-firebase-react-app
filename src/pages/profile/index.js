import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

import { withRouter } from 'react-router-dom'

import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Button from '@material-ui/core/Button';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';


import { InputBase } from '@material-ui/core';
import Input from '@material-ui/core/Input';

import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import WcIcon from '@material-ui/icons/Wc';
import FaceIcon from '@material-ui/icons/Face';
import { dateTime } from '../../model/dateTime';
import { useProfile } from '../../controllers';


function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', '+', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};


function Profile(props) {

    const [photoURL, setPhotoURL] = useState(null)
    const [displayName, setDisplayName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [sex, setSex] = useState(null)
    const [age, setAge] = useState(null)
    const [statusEdit, setStatusEdit] = useState(true)
    const [nullProfile, setNullProfile] = useState(true)
    const [currencies, setCurrencies] = useState([
        {
            value: 0,
            label: 'ไม่ระบุ',
        },
        {
            value: 1,
            label: 'Man',
        },
        {
            value: 2,
            label: 'Women',
        }
    ])
    const { isProfile } = useProfile(props)

    useEffect(() => {

        if (statusEdit !== false) {
            if (isProfile !== null) {
                setNullProfile(false)

                if (isProfile.photoURL !== undefined) {

                    setPhotoURL(isProfile.photoURL);
                } else {
                    if (photoURL === null) {
                        setPhotoURL('https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiTltSo4MDkAhURUI8KHffBDJUQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.onlinewebfonts.com%2Ficon%2F227642&psig=AOvVaw0nPTqj6ZudRIcCKQWYbHEk&ust=1568015831780316')
                    }
                }

                if (isProfile.displayName !== undefined) {

                    setDisplayName(isProfile.displayName);
                } else {
                    if (displayName === null) {
                        setDisplayName('ไม่ระบุ');
                    }
                }

                if (isProfile.email !== undefined) {

                    setEmail(isProfile.email);
                } else {
                    if (email === null) {
                        setEmail('ไม่ระบุ');
                    }
                }

                if (isProfile.phoneNumber !== undefined) {

                    setPhoneNumber(isProfile.phoneNumber);
                } else {
                    if (phoneNumber === null) {
                        setPhoneNumber('ไม่ระบุ');
                    }
                }

                if (isProfile.sex !== undefined) {

                    setSex(isProfile.sex);
                } else {
                    if (sex === null) {
                        setSex('ไม่ระบุ');
                    }
                }

                if (isProfile.age !== undefined) {

                    setAge(isProfile.age);
                } else {
                    if (age === null) {
                        setAge('ไม่ระบุ');
                    }
                }
            } else {
                setNullProfile(true)
            }
        }
    })


    const displayNameInputUpdate = event => {
        setDisplayName(event.target.value)
    }

    const emailInputUpdate = event => {
        setEmail(event.target.value)
    }

    const phoneNumberInputUpdate = event => {
        setPhoneNumber(event.target.value)
        console.log(event.target.value);

    }

    const sexInputUpdate = event => {
        setSex(event.target.value)
    }

    const ageInputUpdate = event => {
        setAge(event.target.value)
    }

    // const goBack = () => {
    //     props.history.goBack()
    // }

    const onEdit = () => {

        setStatusEdit(false)
    }


    const onSave = () => {
        let data = {
            displayName: displayName,
            email: email,
            photoURL: photoURL,
            phoneNumber: phoneNumber,
            sex: sex,
            age: age
        }
        console.log(data);

        let path = `users/${props.match.params.id}/profile/`
        let _log = `users/${props.match.params.id}/profile/_log/`


        props.db.database().ref(`${path}`).set(data).then(() => {
            props.db.database().ref(`${_log}`).push({
                profile: data,
                date: dateTime
            }).then(() => {
                setStatusEdit(true)
                window.location.reload()
            })
        })


    }




    const { classes } = props;

    return (
        <React.Fragment>
            {nullProfile !== true
                ? (<React.Fragment>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={props.history.goBack} style={{ position: "absolute" }}>
                            <ChevronLeftIcon fontSize="large" />
                        </IconButton>
                        <div style={{
                            backgroundColor: 'darkgrey',
                            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
                        }}>
                            <Grid container justify="center" alignItems="center">
                                <Avatar
                                    alt="Remy Sharp"
                                    src={photoURL}
                                    className={classes.bigAvatar}
                                    style={{
                                        border: '4px solid #fff',
                                        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
                                    }}
                                />
                            </Grid>
                        </div>
                    </div>
                    <List style={{
                        marginTop: '15px'
                    }}>
                        <ListItem button key={0}>
                            <ListItemIcon style={{
                                minWidth: 0,
                                marginLeft: 15,
                                marginRight: 15
                            }}> <PersonIcon fontSize="large" /></ListItemIcon>
                            <ListItemText >
                                <span style={{ fontSize: "large" }} >
                                    ชื่อ: <InputBase onChange={displayNameInputUpdate} type="text" disabled={statusEdit} value={displayName} />
                                </span>
                            </ListItemText>
                        </ListItem>
                        <ListItem button key={1}>
                            <ListItemIcon style={{
                                minWidth: 0,
                                marginLeft: 15,
                                marginRight: 15
                            }}> <EmailIcon fontSize="large" /></ListItemIcon>
                            <ListItemText >
                                <span style={{ fontSize: "large" }} >
                                    E-mail: <InputBase onChange={emailInputUpdate} type="text" disabled={statusEdit} value={email} />
                                </span>
                            </ListItemText>
                        </ListItem>
                        <ListItem button key={1}>
                            <ListItemIcon style={{
                                minWidth: 0,
                                marginLeft: 15,
                                marginRight: 15
                            }}> <PhoneIcon fontSize="large" /></ListItemIcon>
                            <ListItemText >
                                <span style={{ fontSize: "large" }} >
                                    เบอร์โทร: <Input
                                        onChange={phoneNumberInputUpdate}
                                        inputComponent={TextMaskCustom}
                                        disabled={statusEdit}
                                        value={phoneNumber} />
                                </span>
                            </ListItemText>
                        </ListItem>
                        <ListItem button key={1}>
                            <ListItemIcon style={{
                                minWidth: 0,
                                marginLeft: 15,
                                marginRight: 15
                            }}> <WcIcon fontSize="large" /></ListItemIcon>
                            <ListItemText >
                                <span style={{ fontSize: "large" }} >
                                    เพศ: <TextField
                                        id="outlined-select-currency"
                                        select
                                        disabled={statusEdit}
                                        value={sex}
                                        onChange={sexInputUpdate}
                                        SelectProps={{
                                            MenuProps: {
                                                // className: classes.menu,
                                            },
                                        }}
                                    >
                                        {currencies.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </span>
                            </ListItemText>
                        </ListItem>
                        <ListItem button key={1}>
                            <ListItemIcon style={{
                                minWidth: 0,
                                marginLeft: 15,
                                marginRight: 15
                            }}> <FaceIcon fontSize="large" /></ListItemIcon>
                            <ListItemText >
                                <span style={{ fontSize: "large" }} >
                                    อายุ: <InputBase onChange={ageInputUpdate} type="number" disabled={statusEdit} value={age} />
                                </span>
                            </ListItemText>
                        </ListItem>
                    </List>
                    {props.match.params.id === props.isUsersPrivate.uid
                        ? (<React.Fragment>
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                width: '-webkit-fill-available'
                            }}>

                                {statusEdit === true
                                    ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            // className={classes.button}
                                            style={{
                                                width: '-webkit-fill-available',
                                                height: '56px',
                                                borderRadius: '0px'
                                            }}
                                            onClick={onEdit}>แก้ไขข้อมูล</Button>
                                    )
                                    : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            // className={classes.button}
                                            style={{
                                                width: '-webkit-fill-available',
                                                height: '56px',
                                                borderRadius: '0px'
                                            }}
                                            onClick={onSave}>บันทึก</Button>
                                    )
                                }
                            </div>
                        </React.Fragment>)
                        : (<React.Fragment>
                        </React.Fragment>)
                    }
                </React.Fragment>)
                : (<React.Fragment>
                    ไม่มีโปรไฟล์ที่คนต้องการ
                    </React.Fragment>)
            }
        </React.Fragment>
    );

}


const styles = {
    bigAvatar: {
        margin: 10,
        marginTop: 50,
        width: 90,
        height: 90,
    },
    drawerHeader: {
        display: 'contents',
        alignItems: 'center',
        padding: 5,
        justifyContent: 'flex-end',
    },
}

Profile.propTypes = {
    db: PropTypes.object,
    isUsersPrivate: PropTypes.object,
    isLocation: PropTypes.object,
}

export default withStyles(styles)(withRouter(Profile));