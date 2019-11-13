import React from 'react';
import './App.css';
import Loading from './pages/loading';
import PropTypes from 'prop-types';
import SignInScreen from './pages/auth';
import Private from './pages/private';
import { useAuth, useLocation, useUsersPrivate } from './controllers'


function App(props) {
  const { isLoading, isAuth } = useAuth(props);
  const { isUsersPrivate } = useUsersPrivate(props)
  const { isLocation } = useLocation(props);

  return (
    <React.Fragment>
      {isLoading !== false
        ? <Loading />
        : <React.Fragment>
          {isAuth !== null
            ? <React.Fragment>
              <Private db={props.db} isUsersPrivate={isUsersPrivate} isLocation={isLocation} />
            </React.Fragment>
            : <SignInScreen firebase={props.db} />
          }
        </React.Fragment>}

    </React.Fragment>
  );
}

App.propTypes = {
  db: PropTypes.object
}

export default App;
