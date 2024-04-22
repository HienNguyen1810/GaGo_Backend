import React from 'react';
import PropTypes from 'prop-types';

const Point = ({ fill, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" {...rest}
  viewBox="0 0 320 512"><path fill={fill} d="M320 144C320 223.5 255.5 288 176 288C96.47 288 32 223.5 32 144C32 64.47 96.47 0 176 0C255.5 0 320 64.47 320 144zM192 64C192 55.16 184.8 48 176 48C122.1 48 80 90.98 80 144C80 152.8 87.16 160 96 160C104.8 160 112 152.8 112 144C112 108.7 140.7 80 176 80C184.8 80 192 72.84 192 64zM144 480V317.1C154.4 319 165.1 319.1 176 319.1C186.9 319.1 197.6 319 208 317.1V480C208 497.7 193.7 512 176 512C158.3 512 144 497.7 144 480z"/></svg>
);





Point.defaultProps = {
  fill: '#9EA7B8',
};

Point.propTypes = {
  fill: PropTypes.string,
};

export default Point;