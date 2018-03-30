import React from 'react';
import { IndexRoute, Route } from 'react-router';
import Storage from './utils/Storage';
import { types } from './actions/user';
import configs from './configs';
import userStatus from './configs/userStatus';
import userType from './configs/userType';
import {
  App,
  Home,
  Layout,
  Register,
  // LoginLayout,
  // AboutLayout,
  NotFound
} from './containers';
import Request from './utils/Request';

let loaded = false;
let validToken = false;

export default store => {
  function getUserToken() {
    const user = Storage.get(configs.authToken);
    if (!loaded) {
      store.dispatch({
        type: types.LOGIN_SUCCESS,
        payload: user
      });
      loaded = true;
    }
    return user;
  }

  const requireLogin = (path, nextState, replace, cb) => {
    console.log(path);
    function checkAuth() {
      const user = getUserToken();
      if (!user) {
        replace('/login');
        cb();
      } else {        
        cb();
      }
    }
    checkAuth();
  };

  getUserToken();

  return (
    <Route component={App}>
      {/* <Route path="/register" component={Register}/> */}
      <Route path="/" component={Layout}>
        <IndexRoute onEnter={requireLogin.bind(null, '/home')} component={Home} />
        <Route
          path="/kill"
          onEnter={requireLogin.bind(null, '/kill')}
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Slaughterhouse').default);
            });
          }}
        />
        <Route
          path="/out"
          onEnter={requireLogin.bind(null, '/out')}
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Out').default);
            });
          }}
        />
        <Route
          path="/preKill"
          onEnter={requireLogin.bind(null, '/preKill')}
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/WaitingSlaughter').default);
            });
          }}
        />
        <Route
          path="/search"
          onEnter={requireLogin.bind(null, '/search')}
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Search').default);
            });
          }}
        />
        <Route
          path="/search1"
          onEnter={requireLogin.bind(null, '/search1')}
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Search').default);
            });
          }}
        />
        <Route
          path="/register"
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Layout/register').default);
            });
          }}
        />
        <Route
          path="/login"
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Layout/login').default);
            });
          }}
        />
        <Route
          path="/come"
          getComponent={(nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('./containers/Come').default);
            });
          }}
        />
      </Route>
      {/* <Route path="/register" component={Register} /> */}
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
