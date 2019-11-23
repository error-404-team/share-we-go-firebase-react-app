import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { dateTime } from '../../../../model/dateTime';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {

  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      
      if (open && onEnter) {
       
        onEnter();
      
      };

    },
    onRest: () => {
      
      if (!open && onExited) {
        
        onExited();
      
      };

    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

function AlertCheck(props) {

  const classes = useStyles();

  function updateChat() {

    // console.time('ฉันคาดว่า 🤔 share => uid => chat ใช้เวลาในการ อ่าน ไป');

    props.db.database().ref(`share/${props.isAuth.uid}/chat`).once("value").then(function (chat_value) {

      let chatData = (chat_value.val());

      if (chatData !== null) {

      } else {

        // console.time('ฉันคาดว่า 🤔 share => uid => chat ใช้เวลาในการ เพิ่ม ไป');

        props.db.database().ref(`share/${props.isAuth.uid}/chat`).push({
          uid: props.isAuth.uid,
          share_id: props.isAuth.uid,
          profile: {
            displayName: "Addmin",
            photoURL: ''
          },
          msg: 'เริ่มการสนทนา',
          date: dateTime
        }).then(() => {

          props.history.push('/');

          window.location.reload();

        });

      };

    }).then(() => {

      props.history.push('/');

      window.location.reload();

    });

    // console.timeEnd('ฉันคาดว่า 🤔 share => uid => chat ใช้เวลาในการ อ่าน ไป');

  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
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
            <center>
              <h2 id="spring-modal-title">คุณได้ทำการเปิดการแชร์โลเคชันแล้ว</h2>
              <p>กดปุ่ม ตกลง เพื่อเข้าสู้หน้าแรก</p>
              <Button variant="contained" onClick={updateChat} style={{ backgroundColor: '#274D7D', color: "aliceblue" }}>
                ตกลง
              </Button>
            </center>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};


AlertCheck.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  db: PropTypes.object,
  isAuth: PropTypes.object
};

export default withRouter(AlertCheck);