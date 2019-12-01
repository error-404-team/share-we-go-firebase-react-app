import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px',
        border: '#faebd700',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
}))

const ModelExitShare = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false)

    const removeShare = () => {

        setLoading(true)

        let updateStatus = {
            uid: `${props.uid}`,
            share_id: `${props.uid}`,
            value: false
        }

        props.db.firestore().collection('history').doc(props.uid).collection('store').add(props.isShare);
        props.db.database().ref(`status/${props.uid}`).update({
            owner: updateStatus,
            member: updateStatus,
            alert: updateStatus
        });
        props.db.firestore().collection(`share`).doc(props.isShare.owner.id).update({
            member: null
        })

        setTimeout(() => {
            props.history.push('/')
        }, 15000)

    }
    return (
        <React.Fragment>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.open}
                onClose={props.onClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.open}>
                    {loading !== true
                        ? (
                            <div className={classes.paper}>
                                <Grid container justify="center" alignItems="center" >
                                    <center>
                                        <h1>คุณต้องการอยากจะออกจากกลุ่มแชร์</h1>

                                        <Button onClick={removeShare} >ตกลง</Button>
                                    </center>
                                </Grid>
                            </div>
                        )
                        : (<React.Fragment>
                            <div className={classes.paper}>
                                <Grid container justify="center" alignItems="center" >
                                    <center>กรุณารอสักครู่......</center>
                                </Grid>
                            </div></React.Fragment>)
                    }
                </Fade>
            </Modal>
        </React.Fragment>
    );

};

ModelExitShare.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    uid: PropTypes.string,
    isShare: PropTypes.object,
    db: PropTypes.object
};

export default withRouter(ModelExitShare)