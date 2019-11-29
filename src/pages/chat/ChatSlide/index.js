import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Loading } from './components/Loading';
import ChatBar from '../ChatBar';
import InputCaht from '../InputChat';
import { withRouter } from 'react-router-dom';
import './styles/chat-box.css';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: (window.innerWidth),
        flexShrink: 0,
    },
    drawerPaper: {
        width: (window.innerWidth),
    }
}));

function useProfile(props) {

    // console.time('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    const [updateProfile, setState] = useState({
        isProfile: null
    })

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

        async function update() {

            // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {
                const unsubscribe = await props.db.firestore().collection('users').doc(props.isAuth.uid).get().then(function (doc) {

                    if (!doc.exists) {

                        // console.log('ข้อมูลโปรไฟล์ ใน database ไม่มี ฉันจะทำการ ฉันจะทำการสร้างข้อมูลโปรไฟล์ ใน database ให้ oK นะ 👌');

                        // console.time('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                        props.db.firestore().collection('users').doc(props.isAuth.uid).update({ profile: props.isAuth.providerData[0] })

                        // console.timeEnd('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                        setState({ isProfile: props.isAuth.providerData[0] });

                    } else {

                        // console.log('ข้อมูลโปรไฟล์ ใน ฐานข้อมูล ✔');

                        setState({ isProfile: doc.data().profile });

                    }
                });

                return unsubscribe;

            };

            // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

        };

        update();

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

    }, [props]);

    // console.timeEnd('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    return updateProfile;

};


function ChatSlide(props) {

    const theme = useTheme();
    const classes = useStyles();
    const [isChat, setChat] = useState(null)
    const [isMsg, setMsg] = React.useState(null)
    const { isProfile } = useProfile(props)
    // const { isShare } = useShare(props)

    const sendMsg = () => {

        props.db.database().ref(`share/${props.match.params.id}/chat`).push({
            uid: props.isAuth.uid,
            share_id: props.match.params.id,
            photoURL: isProfile.photoURL,
            msg: `${isMsg}`,
            date: Date.now()
        });

        setMsg('');

    }

    const updateMsg = (e) => {

        setMsg(e.target.value);

        if (isChat !== null) {
            setChat(isChat)
        }
    }

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function ChatSlide ใช้เวลาในการทำงานไป');

        async function update() {

            // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function ChatSlide => function update ใช้เวลาในการทำงานไป');

            await props.db.database().ref(`share/${props.match.params.id}/chat`).once("value").then(function (chat_value) {

                let chatData = (chat_value.val());

                if (chatData !== null) {

                    setChat(chatData);

                };

            });

            // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function ChatSlide => function update ใช้เวลาในการทำงานไป');

        };

        update();

        // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function ChatSlide ใช้เวลาในการทำงานไป');

    })

    return (
        <Fragment>
            {/* <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            > */}
            {isChat !== null
                ? (<Fragment>
                    <ChatBar>
                        <IconButton onClick={() => {props.history.push('/')}} style={{ position: "absolute", left: 0 }}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon fontSize="large" /> : <ChevronRightIcon fontSize="large" />}
                        </IconButton>
                        <div style={{
                            position: 'absolute',
                            left: (window.innerWidth / 2.2),
                        }}>
                            <h2>Chat</h2>
                        </div>
                    </ChatBar>

                    <div className="box">
                        <div className="chat-box">
                            {isChat !== null
                                ? (<Fragment>
                                    {Object.keys(isChat).map((key) => (
                                        <Fragment>
                                            {props.isAuth.uid === isChat[key].uid
                                                ? (<Fragment>
                                                    <div class="container darker">
                                                        <img src={`${isChat[key].photoURL}`} alt="Avatar" class="right" />
                                                        <h4 style={{
                                                            marginTop: 0
                                                        }} class="left">{isChat[key].displayName}</h4>
                                                        <p class="left">{isChat[key].msg}</p>
                                                    </div>
                                                </Fragment>)
                                                : (<Fragment>
                                                    <div class="container">
                                                        <img src={`${isChat[key].photoURL}`} alt="Avatar" class="left" />
                                                        <h4 tyle={{
                                                            marginTop: 0
                                                        }} class="right">{isChat[key].displayName}</h4>
                                                        <p class="right">{isChat[key].msg}</p>
                                                    </div>
                                                </Fragment>)
                                            }
                                        </Fragment>
                                    ))}
                                </Fragment>)
                                : (<Fragment></Fragment>)
                            }
                        </div>
                    </div>
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        width: '-webkit-fill-available',
                        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
                    }}>
                        <InputCaht value={isMsg} onChange={updateMsg} onClick={sendMsg} />
                    </div>
                </Fragment>)
                : (<Loading onClose={props.onClose} />)
            }
            {/* </Drawer> */}
        </Fragment>
    )
}

ChatSlide.protoType = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    isAuth: PropTypes.string,
    db: PropTypes.object,
    isProfile: PropTypes.object,
}

export default withRouter(ChatSlide);