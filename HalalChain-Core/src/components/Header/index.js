import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal } from 'antd';
import { getPath } from '../../utils';
import { userArray } from '../../configs/typeList';

import './index.less';

function gotoLink(link) {
  // router.push(link);
  window.location.href = `/${link}`;
}

const Header = ({ userInfo, router, location, logout, handleDialog }) => {
  const orgName = userInfo.user.orgName;
  return (
    <div className="Header">
      <div className="logo" />
      <div className="top-btn">
        <div className="user-name">
          <span className="use-icon" />
          {userArray[orgName]}
        </div>
        <span
          onClick={e => {
            // e.isDefaultPrevented();
            handleDialog(true);
            // return false;
          }}
          className="yin-dao-icon"
        />
        <div className="logout" onClick={() => gotoLink('login')}>
          <span className="out-icon" />Sign Out
        </div>
      </div>
    </div>
  );
};
export default Header;
