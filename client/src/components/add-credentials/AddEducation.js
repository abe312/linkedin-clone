import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; // if we want to redirect from action then we need withRouter
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEducation } from '../../store/actions/profileActions';

class AddEducation extends Component {
  state = {
    school: '',
    degree: '',
    field: '',
    from: '',
    to: '',
    current: false,
    description: '',
    errors: {},
    disabled: false,
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onCheck = e => {
    this.setState({
      disabled: !this.state.disabled,
      current: !this.state.current,
    });
  };
  onSubmit = e => {
    e.preventDefault();

    const {
      school,
      degree,
      field,
      from,
      to,
      current,
      description,
    } = this.state;

    const eduData = {
      school,
      degree,
      field,
      from,
      to,
      current,
      description,
    };
    this.props.addEducation(eduData, this.props.history);
    console.log('submit');
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  render() {
    const { errors } = this.state;
    return (
      <div className='add-education'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <Link to='/dashboard' className='btn.btn-light'>
                Go back
              </Link>
              <h1 className='display-4 text-center'>Add Education</h1>
              <p className='lead text-center'>
                Add any school, bootcamp, etc that you have attended
              </p>
              <small className='d-block pb-3'>* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder='* school'
                  name='school'
                  value={this.state.school}
                  onChange={this.onChange}
                  error={errors.school}
                />
                <TextFieldGroup
                  placeholder='* degree'
                  name='degree'
                  value={this.state.degree}
                  onChange={this.onChange}
                  error={errors.degree}
                />
                <TextFieldGroup
                  placeholder='field of study'
                  name='field'
                  value={this.state.field}
                  onChange={this.onChange}
                  error={errors.field}
                />

                <h6>From Date</h6>
                <TextFieldGroup
                  placeholder='from'
                  name='from'
                  type='date'
                  value={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                />
                <h6>To Date</h6>
                <TextFieldGroup
                  placeholder='to'
                  name='to'
                  type='date'
                  value={this.state.to}
                  onChange={this.onChange}
                  error={errors.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                />
                <div className='form-check mb-4'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    name='current'
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheck}
                    id='current'
                  />
                  <label htmlFor='current' className='form-check-label'>
                    Current Program?
                  </label>
                </div>

                <TextAreaFieldGroup
                  placeholder='Program Description'
                  name='description'
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info='Tell us about the program'
                />
                <input
                  type='submit'
                  value='Submit'
                  className='btn btn-info btn-block mt-4'
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEducation.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addEducation: PropTypes.func.isRequired,
};

const mapStateToProps = ({ profile, errors }) => ({
  profile,
  errors,
});

export default connect(mapStateToProps, { addEducation })(
  withRouter(AddEducation)
);
