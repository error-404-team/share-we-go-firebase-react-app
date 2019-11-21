import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Loading from './pages/loading';
import PropTypes from 'prop-types';
import SignInScreen from './pages/auth';
import Private from './pages/private';
import Profile from './pages/profile';
import DocTaxi from './pages/doc_taxi';
import ShareLocation from './pages/share_location';
import History from './pages/history';
import Report from './pages/report';
// import { useAuth, useLocation, useUsersPrivate } from './controllers'

const useAuth = (props) => {

  console.time('ฉันคาดว่า 🤔 function useAuth ใช้เวลาในการทำงานไป');

  const [updateAuth, setState] = useState({
    isLoading: true,
    isAuth: null
  });

  useEffect(() => {

    console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useAuth ใช้เวลาในการทำงานไป');

    const unsubscribe = props.db.auth().onAuthStateChanged((user) => {

      let stringifyData = JSON.stringify(user)

      if (user) {

        console.log('มีการ login อยู่นะ 😂');
        console.time('ฉันคาดว่า 🤔 การดึงข้อมูลจาก collection users ของ firestore ใช้เวลาในการทำงานไป');

        props.db.firestore().collection('users').doc(user.uid).get().then(function (doc) {

          if (doc.exists) {

            console.log("ฉันได้ทำการเชคข้อมูล users ok! 😮 มีข้อมูล users อยู่ในฐานข้อมูล: ", doc.data());

          } else {
            // doc.data() will be undefined in this case
            console.log("ฉันไม่เจอข้อมูล users อยู่ในฐานข้อมูล ฉันจะทำการสร้างมันใหม่ 🥱");
            console.time('ฉันคาดว่า 🤔 ใช้เวลาในการสร้าง ฐานข้อมูล users => uid => auth ไป');

            props.db.firestore().collection('users').doc(user.uid).set({ auth: JSON.parse(stringifyData) }).then(() => {

              console.log('สร้างฐานข้อมูล users => uid => auth เสร็จสิ้น ✔');

            });

            console.timeEnd('ฉันคาดว่า 🤔 ใช้เวลาในการสร้าง ฐานข้อมูล users => uid => auth ไป');

          };

          console.log('อ่านฐานข้อมูล users => uid => auth เสร็จสิ้น ✔ ');

        }).catch(function (error) {

          console.log("มันมีการผิดพลาด ในการรับข้อมูลใน ฐานข้อมูล 😨:", error);

        });

        console.timeEnd('ฉันคาดว่า 🤔 การดึงข้อมูลจาก collection users ของ firestore ใช้เวลาในการทำงานไป');

        setState({ isLoading: false, isAuth: user });

      } else {

        console.log('ยังไม่ได้มีการ login เลยอ่ะ 😒');

        setState({ isLoading: false, isAuth: null });

      }
    });

    console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useAuth ใช้เวลาในการทำงานไป');

    return unsubscribe;

  }, [props]);

  console.timeEnd('ฉันคาดว่า 🤔 function useAuth ใช้เวลาในการทำงานไป');

  return updateAuth;

}


function App(props) {

  const { isLoading, isAuth } = useAuth(props);

  return (
    <React.Fragment>
      <Router>
        {isLoading !== false
          ? <Loading />
          : <React.Fragment>
            {isAuth !== null
              ? (<React.Fragment>
                <Route path="/" exact>
                  <Private db={props.db} isAuth={isAuth} />
                </Route>
                <Route path="/private" >
                  <Private db={props.db} isAuth={isAuth} />
                </Route>
                <Route path="/profile/:id" >
                  <Profile db={props.db} isAuth={isAuth} />
                </Route>
                <Route path="/share_location" >
                  <ShareLocation db={props.db} isAuth={isAuth} />
                </Route>
                <Route path="/history" >
                  <History db={props.db} isAuth={isAuth} />
                </Route>
                <Route path="/doc_taxi/:id" >
                  <DocTaxi db={props.db} />
                </Route>
                <Route path="/report/:id" >
                  <Report db={props.db} isAuth={isAuth} />
                </Route>
              </React.Fragment>
              )
              : (<React.Fragment>
                <Route path="/" exact>
                  <SignInScreen firebase={props.db} />
                </Route>
                <Route path="/login">
                  <SignInScreen firebase={props.db} />
                </Route>
              </React.Fragment>)
            }
          </React.Fragment>}
      </Router>
    </React.Fragment>
  );
}

App.propTypes = {
  db: PropTypes.object
}

export default App;
