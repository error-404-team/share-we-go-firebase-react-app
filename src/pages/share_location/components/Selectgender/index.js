import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
    const [value, setValue] = React.useState('ทุกเพศ');

    // const socket = io(`http://localhost:8080/`);

    function handleChange(event) {

        setValue(event.target.value);

    };

    // console.time('ฉันคาดว่า 🤔 share => uid => sex');

    props.db.firestore().collection(`share`).doc(props.isAuth.uid).update({
        sex: { value: value }
    }).then(() => {

        // console.log('อัพเดต เพศ แล้วนะ 😍');

    });

    // console.timeEnd('ฉันคาดว่า 🤔 share => uid => sex');

    return (
        <div style={{ backgroundColor: props.backgroundColor }} className={classes.root}>
            <center>
                <FormControl component="fieldset" className={classes.formControl}>

                    <FormLabel component="legend">กำหนดเพศเพื่อนร่วมทาง</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        className={classes.group}
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="ชาย" control={<Radio color="primary" />} label="ชาย" />
                        <FormControlLabel value="หญิง" control={<Radio color="primary" />} label="หญิง " />
                        <FormControlLabel value="ทุกเพศ" control={<Radio color="primary" />} label="ทุกเพศ " />

                    </RadioGroup>
                </FormControl>
            </center>
        </div>
    );
};

RadioButtonsGroup.propTypes = {
    db: PropTypes.object,
    isAuth: PropTypes.object,
    backgroundColor: PropTypes.string
};