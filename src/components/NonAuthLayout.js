import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import withRouter from './Common/withRouter';
import { createSelector } from "reselect";

const NonAuthLayout = (props) => {

  return (
    <React.Fragment>{props.children}</React.Fragment>
  );
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object
};

export default withRouter(NonAuthLayout);
