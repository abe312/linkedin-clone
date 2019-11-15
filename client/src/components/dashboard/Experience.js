import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExperience } from '../../store/actions/profileActions';
// import Moment from 'react-moment';

const Experience = props => {
  const onDeleteClick = id => {
    props.deleteExperience(id);
  };
  const experience = props.experience.map(exp => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td>{exp.title}</td>
      <td>
        {exp.from && exp.from} - {exp.to ? exp.to : 'Now'}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => onDeleteClick(exp._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <div>
      <h4 className='mb-4'>Experience Credentials</h4>
      <table className='table'>
        <thead>
          <tr>
            <th>company</th>
            <th>title</th>
            <th>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{experience}</tbody>
      </table>
    </div>
  );
};

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
