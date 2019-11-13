import React, { useState } from 'react';
// import Router from 'next/router';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
// import { ThemeProvider, withStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
// import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
// import { createMuiTheme } from '@material-ui/core/styles';
import ShareLocationBar from './components/ShareLocationBar';
import PlaceAutocompleteAndDirections from './components/PlaceAutocompleteAndDirections';
import CustomDateTimePicker from './components/CustomDateTimePicker';
import TravelCompanion from './components/TravelCompanion';
// import geno from '../image/geno.svg'
import Selectgender from './components/Selectgender';
import { Link, withRouter } from 'react-router-dom';
import CommuteIcon from '@material-ui/icons/Commute';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

// import firebase from '../../connect/firebase';
// import { post, get } from '../../RESTful_API';
import { dateTime } from '../../module';
// import { setDate } from 'date-fns';
import AlertCheck from './components/AlertCheck';
import { useProfile, useShareId } from '../../StoreData';


require('es6-promise').polyfill();
require('isomorphic-fetch');



// const share_location_theme = createMuiTheme({
//     palette: {
//         primary: {
//             main: 'rgba(255, 255, 255, 0)',
//         }
//     },
// });

// function QontoStepIcon(props) {
//     const classes = useQontoStepIconStyles();
//     const { active, completed } = props;

//     return (
//         <div
//             className={clsx(classes.root, {
//                 [classes.active]: active,
//             })}
//         >
//             {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
//         </div>PlaceAutocompleteAndDirections
//     )
// }

// const useQontoStepIconStyles = makeStyles({
//     root: {
//         color: '#eaeaf0',
//         display: 'flex',
//         height: 22,
//         alignItems: 'center'
//     },
//     active: {
//         color: '#784af4'
//     },
//     circle: {
//         width: 8,
//         height: 8,
//         borderRadius: '50%',
//         backgroundColor: 'currentColor'
//     },
//     completed: {
//         color: '#784af4',
//         zIndex: 1,
//         fontSize: 18
//     }
// })


function getSteps() {
    return ['เส้นทาง', 'วันเวลา', 'จำนวน', 'เพศ'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            // หน้าสร้างเเชร์ Form 1 ต้นทาง-ปลายทาง 
            return (<PlaceAutocompleteAndDirections />);

        case 1:
            // หน้าสร้างเชร์ ตั้งค่าเวลา Form 2
            return (<CustomDateTimePicker />);
        case 2:
            // หน้าสร้างเชร์ จำนวนเพื่อนร่วมทาง (ขาดเพศ) 
            return (<TravelCompanion />);

        case 3:
            //หน้าเเชร์เลือกเพศ
            return (<Selectgender />);

        default:
            return 'Uknown stepIndex';
    }
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '-webkit-fill-available',
        overflow: 'hidden'
        // padding: '30px 0px 10px 0px'
    },
    button: {
        marginRight: theme.spacing(1),
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        // marginTop: theme.spacing(1),
        // marginBottom: theme.spacing(1),
    },
    nextStaps: {
        height: '45px',
        bottom: '15px',
        width: '-webkit-fill-available',
        position: 'absolute',
        marginLeft: '22px',
        marginRight: '22px',
    },
}));



function ShareLocation(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState(new Set());
    const [skipped, setSkipped] = useState(new Set());
    const [location, setLocation] = useState(new Set());
    const [sex, setSex] = useState(new Set());
    const [max_number, setMaxNumber] = useState(new Set());
    const [date, setDate] = useState(new Set());
    // const [user, setUser] = useState(new Set());
    const [open, setOpen] = useState(false);
    const {profile} = useProfile(props.db,props.auth)
    const {shareId} = useShareId(props.db,props.auth)

    // firebase.auth().onAuthStateChanged((user) => {
    //     setUser(user)
    // })

    const steps = getSteps();

    // console.log(Router);

    function totalSteps() {
        return getSteps().length;
    }

    function isStepOptional(step) {
        return step === 1;
    }

    function handleSkip() {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(prevSkipped => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    }

    function skippedSteps() {
        return skipped.size;
    }

    function completedSteps() {
        return completed.size;
    }

    function allStepsCompleted() {
        return completedSteps() === totalSteps() - skippedSteps();
    }

    function isLastStep() {
        return activeStep === totalSteps() - 1;
    }

    function handleNext() {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed
                // find the first step that has been completed
                steps.findIndex((step, i) => !completed.has(i))
                : activeStep + 1;

        setActiveStep(newActiveStep);
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleStep = step => () => {
        setActiveStep(step);
    };



    function handleComplete() {
        const newCompleted = new Set(completed);
        newCompleted.add(activeStep);
        setCompleted(newCompleted);
        console.log(activeStep);


        if (activeStep === 0) {
            // get.share.location(user.uid).then(function (data) {
                setLocation({
                    start_address: shareId.location.routes[0].legs[0].start_address,
                    end_address: shareId.location.routes[0].legs[0].end_address
                })
            // });
        }
        if (activeStep === 1) {
            // get.share.date(user.uid).then(function (data) {
                setDate({
                    end_time: shareId.date.end_time.value,
                    start_time: shareId.date.start_time.value
                })
            // });
        }

        if (activeStep === 2) {
            // get.share.max_number(user.uid).then(function (data) {
                setMaxNumber({ value: shareId.max_number.value })
            // });
        }

        if (activeStep === 3) {
            // get.share.sex(user.uid).then(function (data) {
                setSex({ value: shareId.sex.value })
            // });

        }


        /**
         * Sigh... it would be much nicer to replace the following if conditional with
         * `if (!this.allStepsComplete())` however state is not set when we do this,
         * thus we have to resort to not being very DRY.
         */
        if (completed.size !== totalSteps() - skippedSteps()) {
            handleNext();
        }
    }


    const handleClose = () => {
        setOpen(false);
    };

    function handleReset() {
        let path_status_share = `status/${props.auth.uid}/share`
        let path_status_share_log = `status/${props.auth.uid}/share/_log`
        let path_status_owner = `status/${props.auth.uid}/owner`
        let path_status_owner_log = `status/${props.auth.uid}/owner/_log`
        let path_share_owner = `share/${props.auth.uid}/owner`
        let path_share_owner_log = `share/${props.auth.uid}/owner/_log`
        let path_share_member = `share/${props.auth.uid}/member`
        let path_share_member_log = `share/${props.auth.uid}/member/_log`

        let data_status_share = { value: "true", uid: props.auth.uid, id: props.auth.uid }
        let data_status_owner = { value: "true", uid: props.auth.uid, id: props.auth.uid }
        let data_share_owner = { id: props.auth.uid, profile: profile }
        let data_share_member = { [props.auth.uid]: { share_id: props.auth.uid, uid: props.auth.uid, profile: profile } }

        props.db.database().ref(`${path_status_share}`).update(data_status_share)
        props.db.database().ref(`${path_status_share_log}`).push({ share: data_status_share, date: dateTime })

        props.db.database().ref(`${path_status_owner}`).update(data_status_owner)
        props.db.database().ref(`${path_status_owner_log}`).push({ owner: data_status_owner, date: dateTime })

        props.db.database().ref(`${path_share_owner}`).update(data_share_owner)
        props.db.database().ref(`${path_share_owner_log}`).push({ owner: data_share_owner, date: dateTime })

        props.db.database().ref(`${path_share_member}`).update(data_share_member)
        props.db.database().ref(`${path_share_member_log}`).push({ member: data_share_member, date: dateTime })

      
        setOpen(true)
        //    props.history.goBack()
    }

    function isStepSkipped(step) {
        return skipped.has(step);
    }

    function isStepComplete(step) {
        return completed.has(step);
    }

    function handleGoBackPage() {
        props.history.goBack();
    }

    function goBack() {
        if (activeStep === 0) {
            handleGoBackPage();
        } else {
            handleBack();
        }
    }



    return (
        <div className={classes.root}>
            <ShareLocationBar>
                <Button onClick={goBack}>
                    <IconButton aria-label="Back" >
                        <ArrowBackIosIcon />
                    </IconButton>
                </Button>
                <Stepper alternativeLabel nonLinear activeStep={activeStep} style={{
                    width: '-webkit-fill-available',
                    padding: '30px 0px 10px 0px'
                }}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const buttonProps = {};
                        if (isStepOptional(index)) {
                            buttonProps.optional = <Typography variant="caption"></Typography>;
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (

                            <Step key={label} {...stepProps} >
                                <StepButton
                                    onClick={handleStep(index)}
                                    completed={isStepComplete(index)}
                                    {...buttonProps}
                                >
                                    {label}
                                </StepButton>

                                {/* <StepLabel StepIconComponent={QontoStepIcon} >{label}</StepLabel> */}

                            </Step>
                        );
                    })}
                </Stepper>
            </ShareLocationBar>
            <div>
                {allStepsCompleted() ? (
                    <div>
                        <center>
                            <div bgcolor="99FF99" shadow="5">
                                <h2>แชร์เส้นทางเสร็จสิ้น <CheckCircleIcon></CheckCircleIcon></h2>
                                <hr />
                            </div>
                        </center>
                        <br />
                        <div bgcolor="#DCDCDC">
                            <center>
                                <hr border="5" shadow="5" />

                                <div>
                                    <div>
                                        <h2><CommuteIcon align></CommuteIcon> ต้นทาง - ปลายทาง</h2>
                                    </div>
                                    <b>ต้นทาง:</b> {location.start_address}
                                    <br />
                                    <b>ปลายทาง:</b> {location.end_address}
                                    <br />
                                    <h2><RecentActorsIcon></RecentActorsIcon> ข้อมูลการแชร์</h2>
                                    <b>เริ่มการแชร์:</b> {date.start_time}
                                    <br />
                                    <b>ปิดการแชร์:</b> {date.end_time}
                                    <br />
                                    <b>ต้องการผู้ร่วมเดินทางเพิ่ม:</b> {max_number.value} คน
                                    <br />
                                    <b>ต้องการร่วมเดินทางกับเพศ: {sex.value}</b>
                                    <hr border="5" shadow="5" />
                                </div>
                            </center>
                        </div>

                        <div style={{
                            position: "fixed",
                            bottom: '25px',
                            width: '-webkit-fill-available'
                        }}>
                            <center >
                                <Button variant="contained" onClick={handleReset} color="primary" >เปิดแชร์</Button>
                            </center>
                        </div>
                        <AlertCheck open={open} onClose={handleClose} />
                    </div>
                ) : (
                        <div>

                            {/* <ThemeProvider theme={share_location_theme}> */}
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                            <div style={{
                                position: 'fixed',
                                bottom: '0px',
                                width: '-webkit-fill-available'
                            }}>
                                {/* <center> */}
                                {/* <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>Back</Button> */}
                                {/* <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >Next</Button>
                                    {isStepOptional(activeStep) && !completed.has(activeStep) && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSkip}
                                            className={classes.button}
                                        >Skip</Button>
                                    )} */}

                                {activeStep !== steps.length &&
                                    (completed.has(activeStep) ? (
                                        <Typography variant="caption" className={classes.completed}>Step {activeStep + 1} already completed</Typography>
                                    ) : (
                                            <Button variant="contained" color="primary" className={classes.nextStaps} onClick={handleComplete}>
                                                {completedSteps() === totalSteps() - 1 ? 'เสร็จสิ้นขั้นตอน' : 'ขั้นตอนถัดไป'}
                                            </Button>
                                        ))}
                                {/* </center> */}
                            </div>
                            {/* </ThemeProvider> */}
                        </div>
                    )}
            </div>
        </div>
    )
}

ShareLocation.propTypes = {
    onClose: PropTypes.func,
    map: PropTypes.object
};

export default withRouter(ShareLocation);