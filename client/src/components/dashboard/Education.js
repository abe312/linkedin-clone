import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteEducation } from '../../store/actions/profileActions';
// import Moment from 'react-moment';

const Education = props => {
  const onDeleteClick = id => {
    props.deleteEducation(id);
  };
  const education = props.education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td>{edu.degree}</td>

      <td>
        {edu.from && edu.from} - {edu.to ? edu.to : 'Now'}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => onDeleteClick(edu._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <div>
      <h4 className='mb-4'>Education Credentials</h4>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th>Degree</th>
            <th>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{education}</tbody>
      </table>
    </div>
  );
};

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
