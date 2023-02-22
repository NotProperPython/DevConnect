import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = ({ auth: { isAuthenticated, loading } }) => {
  return !isAuthenticated && !loading ? <Navigate to="/login" /> : <Outlet />;
};

PrivateRoutes.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoutes);
