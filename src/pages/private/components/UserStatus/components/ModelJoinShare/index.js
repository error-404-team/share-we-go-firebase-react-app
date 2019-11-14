import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
// import { post, d } from '../../../../../../RESTful_API'
// import { dateTime } from '../../../../../../module';
import { useProfile } from '../../../../../../StoreData'

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

const ModelJoinShare = (props) => {
    const classes = useStyles();
    const { isProfile } = useProfile(props)

    const joinShare = () => {
        let path_status_member = `status/${props.isUsersPrivate.uid}/member`;
        let path_share_member = `share/${props.isUsersPrivate.uid}/member`;
        let data_status_member = {
            uid: `${props.isUsersPrivate.uid}`,
            share_id: `${props.share_id}`,
            value: 'true'
        }
        let data_share_member = {
            uid: `${props.isUsersPrivate.uid}`,
            share_id: `${props.share_id}`,
            profile: isProfile

        }
        props.db.database().ref(`${path_status_member}`).update(data_status_member)
        props.db.database().ref(`${path_share_member}`).update(data_share_member)

        props.history.push('/')
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
                                <h1>คุณต้องการเข้าร่วมกลุ่มแชร์นี้</h1>

                                <Button onClick={joinShare} >ตกลง</Button>
                            </center>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </React.Fragment>
    )

}



ModelJoinShare.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
}

export default withRouter(ModelJoinShare)