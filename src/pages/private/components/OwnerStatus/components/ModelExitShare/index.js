import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { dateTime } from '../../../../../../model/dateTime';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #ffc800',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

const ModelExitShare = (props) => {
    const classes = useStyles();

    const removeShare = () => {
        let path_history = `history/${props.auth.uid}`;
        let path_status_owner = `status/${props.auth.uid}/owner`;
        let path_status_owner_log = `status/${props.auth.uid}/owner/_log`;
        let path_share_id = `share/${props.share_id}`


        let data_status_owner = {
            uid: `${props.auth.uid}`,
            share_id: `${props.share_id}`,
            value: 'false'
        }

        props.db.database().ref(`${path_history}`).push(props.share)
        props.db.database().ref(`${path_status_owner}`).update(data_status_owner)
        props.db.database().ref(`${path_status_owner_log}`).push({
            owner: data_status_owner_log,
            date: dateTime
        })
        props.db.database().ref(`${path_share_id}`).delete()

        // setTimeout(() => {
        //     props.history.goBack()
        // }, 3500)

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
                    <div className={classes.paper}>
                        <Grid container justify="center" alignItems="center" >
                            <center>
                                <h1>คุณต้องการอยากจะออกจากกลุ่มแชร์</h1>

                                <Button onClick={removeShare} >ตกลง</Button>
                            </center>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </React.Fragment>
    )

}



ModelExitShare.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
}

export default withRouter(ModelExitShare)