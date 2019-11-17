import React, { Profiler } from 'react';
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
import { useAuth, useLocation, useUsersPrivate } from './controllers'


function App(props) {
  const { isLoading, isAuth } = useAuth(props);
  const { isUsersPrivate } = useUsersPrivate(props)
  const { isLocation } = useLocation(props);

  return (
    <React.Fragment>
      <Router>
        {isLoading !== false
          ? <Loading />
          : <React.Fragment>
            {isAuth !== null
              ? (<React.Fragment>
                <Route path="/" exact>
                  <Private db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
                </Route>
                <Route path="/private" >
                  <Private db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
                </Route>
                <Route path="/profile/:id" >
                  <Profile db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
                </Route>
                <Route path="/share_location" >
                  <ShareLocation db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
                </Route>
                <Route path="/history" >
                  <History db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
                </Route>
                <Route path="/doc_taxi/:id" >
                  <DocTaxi db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
                </Route>
                <Route path="/report/:id" >
                  <Report db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
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
