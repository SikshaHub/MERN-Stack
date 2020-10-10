import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const PostDisplay = ({
  post: { _id, text, name, avatar, likes, comments, date, user },
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img src={avatar} alt='Profile' className='round-img' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
        </p>
      </div>
    </div>
  );
};

PostDisplay.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostDisplay;
