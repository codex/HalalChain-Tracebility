import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { getPath } from '../../utils';

import './index.less';

function gotoLink(link, router) {
  // router.push(link);
  window.location.href = `/${link}`;
}
function checkCurr(link, location) {
  return location.pathname === link;
}
const Left = ({ user, location, logout }) => {
  return (
    <div className="Left">
      <div
        className={
          checkCurr('/preKill', location) ? 'currMenu left-bar' : 'left-bar'
        }
      >
        <div
          onClick={() => {
            gotoLink('preKill');
          }}
          className="left-l left-dai-zai"
        >
          <span className="icon" />
          <span className="text">For Slaughter</span>
        </div>
      </div>
      <div
        className={
          checkCurr('/kill', location) ? 'currMenu left-bar' : 'left-bar'
        }
      >
        <div
          onClick={() => {
            gotoLink('kill');
          }}
          className="left-l left-tu-zai"
        >
          <span className="icon" />
          <span className="text">Slaughter</span>
        </div>
      </div>
      <div className="left-bar">
        <div className="left-l left-jian-yi">
          <span className="icon" />
          <span className="text">Quarantine</span>
        </div>
      </div>
      <div className="left-bar">
        <div className="left-l left-ru-ku">
          <span className="icon" />
          <span className="text">Inbound</span>
        </div>
      </div>
      <div className="left-bar">
        <div className="left-l left-pai-suan">
          <span className="icon" />
          <span className="text">Acid Discharge</span>
        </div>
      </div>
      <div className="left-bar">
        <div className="left-l left-chu-ku">
          <span className="icon" />
          <span className="text">Delivery</span>
        </div>
      </div>
      <div
        className={
          checkCurr('/search1', location) ? 'currMenu left-bar left-bar-5' : 'left-bar left-bar-5'
        }
      >
        <div
          onClick={() => {
            gotoLink('search1');
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
