import React from 'react';
import Header from './Header.js';
import { connect } from 'react-redux';

const Layout = ({children, loading, user}) => (
  <div>
    {loading ? 'loading...' : (
      <div>
        <Header user={user}/>
        {children}
      </div>
    )}
  </div>
);

export default connect(state => state.userState)(Layout);
