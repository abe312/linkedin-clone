import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteComment } from '../../store/actions/postActions';

export class CommentItem extends Component {
  onDeleteClick = (postId, commentId) => {
    this.props.deleteComment(postId, commentId);
    console.log(postId, commentId);
  };
  render() {
    const { comment, postId, auth } = this.props;
    return (
      <div className='card card-body mb-3'>
        <div className='row'>
          <div className='col-md-2'>
            <a href=''>
              <img
                src={comment.avatar}
                alt=''
                className='rounded-circle d-node d-md-block'
              />
            </a>
            <br />
            <p className='text-center'>{comment.name}</p>
          </div>
          <div className='col-md-10'>
            <p className='lead'>{comment.text}</p>

            {comment.user === auth.user.id ? (
              <button
                onClick={() => this.onDeleteClick(postId, comment._id)}
                type='button'
                className='btn btn-danger mr-1'
              >
                <i className='fas fa-times' />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
