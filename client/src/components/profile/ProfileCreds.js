import React, { Component } from 'react';

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expItems = experience.map(exp => (
      <li key={exp._id} className='list-group-item'>
        <h4>{exp.company}</h4>
        <p>
          {exp.from} - {exp.to ? exp.to : 'Now'}
        </p>
        <p>
          <strong>Position: </strong>
          {exp.title}
        </p>
        <p>
          {exp.location && (
            <span>
              <strong>Location: </strong> {exp.location}
            </span>
          )}
        </p>
        <p>
          {exp.description && (
            <span>
              <strong>description: </strong> {exp.description}
            </span>
          )}
        </p>
      </li>
    ));

    const eduItems = education.map(edu => (
      <li key={edu._id} className='list-group-item'>
        <h4>{edu.company}</h4>
        <p>
          {edu.from} - {edu.to ? edu.to : 'Now'}
        </p>
        <p>
          <strong>Degree: </strong>
          {edu.degree}
        </p>
        <p>
          <strong>Field of study: </strong>
          {edu.field}
        </p>
        <p>
          {edu.description && (
            <span>
              <strong>description: </strong> {edu.description}
            </span>
          )}
        </p>
      </li>
    ));

    return (
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='text-center text-info'>Experience</h3>
          {expItems.length > 0 ? (
            <ul className='list-group'>{expItems}</ul>
          ) : (
            <p className='text-center'>No experience listed</p>
          )}
        </div>
        <div className='col-md-6'>
          <h3 className='text-center text-info'>Education</h3>
          {eduItems.length > 0 ? (
            <ul className='list-group'>{eduItems}</ul>
          ) : (
            <p className='text-center'>No Education listed</p>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
