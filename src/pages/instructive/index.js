import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { InputBase, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        // display: 'flex',
        width: '-webkit-fill-available',
        position: 'absolute',
        top: (window.innerHeight / 2.5)
    },
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: theme.spacing(1, 0),
        padding: '10px',
        background: 'white',
        borderRadius: '5px',
    },
}));

function Instructive(props) {

    const classes = useStyles();
    const [value, setValue] = React.useState('');

    // const socket = io(`http://localhost:8080/`);

    function handleChange(event) {

        setValue(event.target.value);

    };

    // console.time('ฉันคาดว่า 🤔 report add vlalue ใ้เวลาในการทำงาน');

    function Send() {
        props.db.firestore().collection(`report`).add({
            value: value,
            uid: props.isAuth.uid
        }).then(() => {

            // console.log('อัพเดต เพศ แล้วนะ 😍');
            props.history.push('/')
        });
    }

    // console.timeEnd('ฉันคาดว่า 🤔 report add vlalue ใ้เวลาในการทำงาน');

    return (
        <React.Fragment>
            <div style={{ backgroundColor: props.backgroundColor }} className={classes.root}>
                <center>
                    <FormControl component="fieldset" className={classes.formControl}>

                        <FormLabel component="legend">ให้คำแนะนำเรา</FormLabel>
                        <InputBase
                            name="report"
                            className={classes.group}
                            value={value}
                            onChange={handleChange}
                        ></InputBase>
                    </FormControl>
                </center>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={Send}
                style={{
                    padding: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '-webkit-fill-available',
                    height: '45px',
                    borderRadius: '0px',
                    bottom: 0,
                    position: 'absolute'
                }}>ส่ง</Button>
        </React.Fragment>
    );
};

Instructive.propTypes = {
    db: PropTypes.object,
    isAuth: PropTypes.object,
    backgroundColor: PropTypes.string
};

export default withRouter(Instructive)