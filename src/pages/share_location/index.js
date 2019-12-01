import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ShareLocationBar from './components/ShareLocationBar';
import PlaceAutocompleteAndDirections from './components/PlaceAutocompleteAndDirections';
import CustomDateTimePicker from './components/CustomDateTimePicker';
import TravelCompanion from './components/TravelCompanion';
import Selectgender from './components/Selectgender';
import { withRouter } from 'react-router-dom';

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
    // const [user, setUser] = useState(new Set());

    // firebase.auth().onAuthStateChanged((user) => {
    //     setUser(user)
    // })

    function getSteps() {

        return ['เส้นทาง', 'วันเวลา', 'จำนวน', 'เพศ'];

    };

    function getStepContent(stepIndex) {

        switch (stepIndex) {
            case 0:
                // หน้าสร้างเเชร์ Form 1 ต้นทาง-ปลายทาง 
                return (<PlaceAutocompleteAndDirections isAuth={props.isAuth} db={props.db} />);

            case 1:
                // หน้าสร้างเชร์ ตั้งค่าเวลา Form 2
                return (<CustomDateTimePicker isAuth={props.isAuth} db={props.db} />);
            case 2:
                // หน้าสร้างเชร์ จำนวนเพื่อนร่วมทาง (ขาดเพศ) 
                return (<TravelCompanion isAuth={props.isAuth} db={props.db} />);

            case 3:
                //หน้าเเชร์เลือกเพศ
                return (<Selectgender isAuth={props.isAuth} db={props.db} />);

            default:
                return 'Uknown stepIndex';
        };

    };

    const steps = getSteps();

    // // console.log(Router);

    function totalSteps() {

        return getSteps().length;

    };

    function isStepOptional(step) {

        return step === 1;

    };

    function skippedSteps() {

        return skipped.size;

    };

    function completedSteps() {

        return completed.size;

    };

    function allStepsCompleted() {

        return completedSteps() === totalSteps() - skippedSteps();

    };

    function isLastStep() {

        return activeStep === totalSteps() - 1;

    };

    function handleNext() {

        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed
                // find the first step that has been completed
                steps.findIndex((step, i) => !completed.has(i))
                : activeStep + 1;

        setActiveStep(newActiveStep);

    };

    function handleBack() {

        setActiveStep(prevActiveStep => prevActiveStep - 1);

    };

    const handleStep = step => () => {

        setActiveStep(step);

    };

    function handleComplete() {

        const newCompleted = new Set(completed);

        newCompleted.add(activeStep);

        setCompleted(newCompleted);

        // console.log(activeStep);

        if (completedSteps() === totalSteps() - 1) {

            props.history.push(`/report/${props.isAuth.uid}`);

        };

        /**
         * Sigh... it would be much nicer to replace the following if conditional with
         * `if (!this.allStepsComplete())` however state is not set when we do this,
         * thus we have to resort to not being very DRY.
         */
        if (completed.size !== totalSteps() - skippedSteps()) {

            handleNext();

        };

    };

    function isStepSkipped(step) {

        return skipped.has(step);

    };

    function isStepComplete(step) {

        return completed.has(step);

    };

    function handleGoBackPage() {

        props.history.goBack();

    };

    function goBack() {

        if (activeStep === 0) {

            handleGoBackPage();

        } else {

            handleBack();

        };

    };

    return (
        <React.Fragment>
            {props.isAuth !== null
                ? (<div className={classes.root}>
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
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </ShareLocationBar>
                    <div>
                        {allStepsCompleted() ? (
                            <React.Fragment></React.Fragment>
                        ) : (
                                <div>
                                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                    <div style={{
                                        position: 'fixed',
                                        bottom: '0px',
                                        width: '-webkit-fill-available'
                                    }}>
                                        {activeStep !== steps.length &&
                                            (completed.has(activeStep) ? (
                                                <Typography variant="caption" className={classes.completed}>Step {activeStep + 1} already completed</Typography>
                                            ) : (
                                                    <Button variant="contained" style={{ backgroundColor: '#274D7D', color: 'white', borderRadius: '12px' }} className={classes.nextStaps} onClick={handleComplete}>
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
                : (<React.Fragment>Loading</React.Fragment>)
            }</React.Fragment>
    )
}

ShareLocation.propTypes = {
    onClose: PropTypes.func,
    map: PropTypes.object,
    isAuth: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object
};

export default withRouter(ShareLocation);