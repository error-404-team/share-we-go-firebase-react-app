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
    const [onload, setOnload] = useState(false)


    function removeShare() {


        // let updateStatus = {
        //     uid: `${props.uid}`,
        //     share_id: `${props.uid}`,
        //     value: false
        // }

        setLoading(true)

        props.db.firestore().collection('history').doc(props.uid).collection('store').add(props.isShare).then(() => {
            Object.keys(props.isShare.member).map(key => {
                console.log(key);
                
                props.db.database().ref(`status/${key}/member`).update({
                    uid: `${key}`,
                    share_id: `${props.uid}`,
                    value: false
                });
            })
        });
        props.db.database().ref(`status/${props.uid}/alert`).update({
            uid: `${props.uid}`,
            share_id: `${props.uid}`,
            value: false
        });

        props.db.database().ref(`status/${props.uid}/member`).update({
            uid: `${props.uid}`,
            share_id: `${props.uid}`,
            value: false
        });

        props.db.database().ref(`status/${props.uid}/owner`).update({
            uid: `${props.uid}`,
            share_id: `${props.uid}`,
            value: false
        });



        props.db.firestore().collection(`share`).doc(props.uid).update({
            member: null
        }).then(function () {

            console.log('ok');
            setOnload(true)
        })


    };

    if (onload === true) {
        window.location.reload()
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