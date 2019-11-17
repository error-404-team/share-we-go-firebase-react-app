import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import { dateTime } from '../../../../model/dateTime';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
    root: {
        // display: 'flex',
        marginTop: (window.innerHeight / 2.5)
    },
    formControl: {
        margin: theme.spacing(3),
    },
    group: {
        margin: theme.spacing(1, 0),
    },
}));

export default function RadioButtonsGroup(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('1');

    // const socket = io(`http://localhost:8080/`);

    function handleChange(event) {
        setValue(event.target.value);
    }

    let path =`share/${props.isUsersPrivate.uid}/max_number`
    let _log =`share/${props.isUsersPrivate.uid}/max_number/_log`

    props.db.database().ref(`${path}`).update({ value: value })
    props.db.database().ref(`${_log}`).push({max_number:{ value: value },date:dateTime})
    // firebase.auth().onAuthStateChanged((user) => {
    //     post.share.max_number(user.uid, { value: value }, dateTime)
    // })
    // socket.emit('number_of_travel', { number_of_travel: value })

    return (
        <div style={{backgroundColor: props.backgroundColor}} className={classes.root}>
            <center>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Travel Companion</FormLabel>
                    <RadioGroup

                        aria-label="gender"
                        name="gender1"
                        className={classes.group}
                        value={value}
                        onChange={handleChange}
                    >

                        <FormControlLabel value="1" control={<Radio color="primary" />} label="+1 คน" />
                        <FormControlLabel value="2" control={<Radio color="primary" />} label="+2 คน" />
                        <FormControlLabel value="3" control={<Radio color="primary" />} label="+3 คน" />

                    </RadioGroup>


                </FormControl>
            </center>
        </div>
    );
}


RadioButtonsGroup.propTypes = {
    isUsersPrivate: PropTypes.object,
    db: PropTypes.object,
    backgroundColor: PropTypes.string
}