import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; // if we want to redirect from action then we need withRouter
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addExperience } from '../../store/actions/profileActions';

class AddExperience extends Component {
  state = {
    company: '',
    title: '',
    location: '',
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
      company,
      title,
      location,
      from,
      to,
      current,
      description,
    } = this.state;

    const expData = {
      company,
      title,
      location,
      from,
      to,
      current,
      description,
    };
    this.props.addExperience(expData, this.props.history);
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
      <div className='add-experience'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <Link to='/dashboard' className='btn.btn-light'>
                Go back
              </Link>
              <h1 className='display-4 text-center'>Add Experience</h1>
              <p className='lead text-center'>
                Add any job or position that you may have had in the past or
                current
              </p>
              <small className='d-block pb-3'>* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder='* Company'
                  name='company'
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                />
                <TextFieldGroup
                  placeholder='*  Job title'
                  name='title'
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <TextFieldGroup
                  placeholder='location'
                  name='location'
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
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
                    Current Job
                  </label>
                </div>

                <TextAreaFieldGroup
                  placeholder='Job Description'
                  name='description'
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info='Tell us about the position'
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

AddExperience.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addExperience: PropTypes.func.isRequired,
};

const mapStateToProps = ({ profile, errors }) => ({
  profile,
  errors,
});

export default connect(mapStateToProps, { addExperience })(
  withRouter(AddExperience)
);
