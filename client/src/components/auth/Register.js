import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { catchErrors } from '../../hoc/catchErrors';

import { connect } from 'react-redux';
import { registerUser } from '../../store/actions/authActions';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';

export class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors }); // once receive the errors from redux set it to component state
    }
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = { ...this.state };
    delete newUser.errors;
    console.log('user', newUser);
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <TextFieldGroup
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar. Make sure your email is linked to that."
                />

                <TextFieldGroup
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <TextFieldGroup
                  type="password"
                  name="password2"
                  placeholder="Confirm Password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, errors }) => ({
  auth,
  errors,
});

const mapDispatchToProps = { registerUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Register));
