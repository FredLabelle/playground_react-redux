import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';

import { NamePropType } from '../../lib/prop-types';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: NamePropType.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
  };
  static defaultProps = { required: false, disabled: false };
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    this.props.onChange(null, { name: this.props.name, value: newValue });
  };
  render() {
    return (
      <Form.Group>
        <Form.Input
          name="firstName"
          value={this.props.value.firstName}
          onChange={this.handleChange}
          label="First name"
          placeholder="First Name"
          required={this.props.required}
          disabled={this.props.disabled}
          width={8}
        />
        <Form.Input
          name="lastName"
          value={this.props.value.lastName}
          onChange={this.handleChange}
          label="Last Name"
          placeholder="Last Name"
          required={this.props.required}
          disabled={this.props.disabled}
          width={8}
        />
      </Form.Group>
    );
  }
}
