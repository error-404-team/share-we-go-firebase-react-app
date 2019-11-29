import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { useProfile } from '../../../../../../StoreData';

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
}));

const ModelJoinShare = (props) => {

    const classes = useStyles();
    const { isProfile } = useProfile(props);

    const joinShare = () => {

        // console.time('ฉันคาดว่า 🤔 status => uid => member ใช้เวลาในการ อัพเดต ไป');

        props.db.database().ref(`status/${props.isUsersPrivate.uid}/member`).update({
            uid: `${props.isUsersPrivate.uid}`,
            share_id: `${props.share_id}`,
            value: true
        });

        // console.timeEnd('ฉันคาดว่า 🤔 status => uid => member ใช้เวลาในการ อัพเดต ไป');
        // console.time('ฉันคาดว่า 🤔 share => uid => member ใช้เวลาในการ อัพเดต ไป');

        props.db.database().ref(`share/${props.isUsersPrivate.uid}/member`).update({
            uid: `${props.isUsersPrivate.uid}`,
            share_id: `${props.share_id}`,
            profile: isProfile

        });

        // console.timeEnd('ฉันคาดว่า 🤔 share => uid => member ใช้เวลาในการ อัพเดต ไป');

        props.history.push('/');

    };

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
    );

};

ModelJoinShare.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export default withRouter(ModelJoinShare);