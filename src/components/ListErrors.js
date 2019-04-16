import React from 'react';

class ListErrors extends React.Component {
  render() {
    const error = this.props.error;
    if (error) {
      return (
        <ul className="error-messages">
          <li>
            {error.message}
          </li>
        </ul>
      );
    } else {
      return null;
    }
  }
}

export default ListErrors;
