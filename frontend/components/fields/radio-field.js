import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';

const RadioPropType = PropTypes.arrayOf(
  PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }),
);

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    radio: RadioPropType.isRequired,
    label: PropTypes.string.isRequired,
  };
  handleChange = (event, { value }) => {
    this.props.onChange(null, { name: this.props.name, value });
  };
  render() {
    return (
      <Form.Group grouped>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        {this.props.radio.map(({ value, label }) =>
          <Form.Radio
            key={value}
            name={value}
            value={value}
            checked={this.props.value === value}
            onChange={this.handleChange}
            label={label}
          />,
        )}
      </Form.Group>
    );
  }
}
