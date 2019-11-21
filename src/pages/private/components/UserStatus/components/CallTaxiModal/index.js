import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from './node_modules/@material-ui/core/styles';

import Backdrop from './node_modules/@material-ui/core/Backdrop';

import Modal from './node_modules/@material-ui/core/Modal';
import Fade from './node_modules/@material-ui/core/Fade';
import Fab from './node_modules/@material-ui/core/Fab';
import Grid from './node_modules/@material-ui/core/Grid';


import CallIcon from './node_modules/@material-ui/icons/Call';

import taxiIcon from './img/icon-taxi.png';


const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #ffc800',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  buttonCall: {
    margin: theme.spacing(1),
  },
  callIcon: {
    marginRight: theme.spacing(1),
  }
}));

const CallTaxiModal = (props) => {

  const classes = useStyles();

  return (
    <Fragment>
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
            <Grid container justify="center" alignItems="center"
              style={{
                width: 'min-content'

              }} >
              <img src={taxiIcon} style={{ width: 150 }} />
              <a href="tel:+66803147507">
                <Fab
                  variant="extended"
                  size="small"
                  color="primary"
                  aria-label="add"
                  className={classes.buttonCall}
                >
                  <CallIcon className={classes.callIcon} />โทร</Fab>
              </a>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </Fragment>
  );
};

CallTaxiModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};



export default CallTaxiModal;