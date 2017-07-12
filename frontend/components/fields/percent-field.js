import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    width: PropTypes.number,
  };
  static defaultProps = { label: '', placeholder: '', required: false, width: 16 };
  handleChange = (event, { value }) => {
    this.props.onChange(event, { name: this.props.name, value });
  };
  render() {
    return (
      <Form.Input
        name="percent"
        value={this.props.value}
        onChange={this.handleChange}
        label={this.props.label}
        placeholder={this.props.placeholder}
        required={this.props.required}
        type="number"
        min="0"
        max="100"
        action={{
          type: 'button',
          basic: true,
          tabIndex: -1,
          content: '%',
          style: { pointerEvents: 'none' },
        }}
        width={this.props.width}
      />
    );
  }
}
