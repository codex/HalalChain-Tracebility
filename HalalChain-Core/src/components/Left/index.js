import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { getPath } from '../../utils';
import KillLeft from './slaughterLeft';
import './index.less';

function gotoLink(link, router) {
  // router.push(link);
  window.location.href = `/${link}`;
}
function checkCurr(link, location) {
  return location.pathname === link;
}

const Left = ({ user, location, logout }) => {
  const killLeftArray = ['/preKill', '/kill'];
  const isKillLeft = killLeftArray.indexOf(location.pathname) > -1;
  const isSearch1 = location.pathname === '/search1';
  if (isKillLeft || isSearch1) {
    return <KillLeft location={location} />;
  }
  return (
    <div className="Left">
      <div
        className={checkCurr('/', location) ? 'currMenu left-bar' : 'left-bar'}
      >
        <div
          onClick={() => {
            gotoLink('');
          }}
          className="left-l left-1"
        >
          <span className="icon" />
          <span className="text">Lairage</span>
        </div>
      </div>
      <div className="left-bar">
        <div className="left-l left-2">
          <span className="icon" />
          <span className="text">Epidemic Prevention</span>
        </div>
      </div>
      <div className="left-bar">
        <div className="left-l left-3">
          <span className="icon" />
          <span className="text">Medications</span>
        </div>
      </div>
      <div
        className={
          checkCurr('/out', location) ? 'currMenu left-bar' : 'left-bar'
        }
      >
        <div
          onClick={() => {
            gotoLink('out');
          }}
          className="left-l left-4"
        >
          <span className="icon" />
          <span className="text">Out Fence</span>
        </div>
      </div>
      <div
        className={
          checkCurr('/search', location)
            ? 'currMenu left-bar left-bar-5'
            : 'left-bar left-bar-5'
        }
      >
        <div
          onClick={() => {
            gotoLink('search');
          }}
          className="left-l left-5"
        >
          <span className="icon" />
          <span className="text">Inquiry</span>
        </div>
      </div>
    </div>
  );
};
export default Left;
