import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import without from 'lodash/without';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    checkboxes: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
  };
  handleChange = (event, { name }) => {
    const checked = this.props.value.includes(name);
    const value = checked ? without(this.props.value, name) : [...this.props.value, name];
    this.props.onChange(null, { name: this.props.name, value });
  };
  render() {
    return (
      <Form.Group grouped>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        {this.props.checkboxes.map(checkbox =>
          <Form.Field
            key={checkbox}
            name={checkbox}
            checked={this.props.value.includes(checkbox)}
            onChange={this.handleChange}
            label={checkbox}
            control={Checkbox}
          />,
        )}
      </Form.Group>
    );
  }
}
