import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileHeader from './ProfileHeader';
import ProfileGithub from './ProfileGithub';
import Spinner from '../common/Spinner';

import { getProfileByHandle } from '../../store/actions/profileActions';

class Profile extends Component {
  componentDidMount() {
    console.log(this.props);
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile == null && this.props.profile.loading) {
      this.props.history.push('/not-found');
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;
    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div>
          <div className='row'>
            <div className='col-md-6'>
              <Link to='/profiles' className='btn btn-light mb-3 float-left'>
                Back To Profiles
              </Link>
            </div>
          </div>
          <div className='col-md-12'>
            <ProfileHeader profile={profile} />
            <ProfileAbout profile={profile} />
            <ProfileCreds
              education={profile.education}
              experience={profile.experience}
            />
            {profile.github && <ProfileGithub username={profile.github} />}
          </div>
        </div>
      );
    }
    return (
      <>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>{profileContent}</div>
          </div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = ({ profile }) => ({
  profile,
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);
