import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({
      name: PropTypes.string.isRequired,
      investmentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };
  onDeleteClick = event => {
    event.preventDefault();
    this.props.onChange(event, { name: this.props.name, value: null });
  };
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: name === 'name' ? value : value.split(','),
    };
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  render() {
    const options = [
      {
        key: 'DealByDeal',
        text: 'Deal by deal',
        value: 'DealByDeal',
      },
      {
        key: 'SystematicWithOptOut',
        text: 'Systematic with opt-out',
        value: 'SystematicWithOptOut',
      },
      {
        key: 'DealByDeal,SystematicWithOptOut',
        text: 'Deal by deal and systematic with opt-out',
        value: 'DealByDeal,SystematicWithOptOut',
      },
    ];
    return (
      <Form.Group>
        <Form.Input
          name="name"
          value={this.props.value.name}
          onChange={this.handleChange}
          label="Name"
          placeholder="Name"
          required
          width={6}
        />
        <Form.Select
          name="investmentMethods"
          value={this.props.value.investmentMethods.join(',')}
          onChange={this.handleChange}
          label="Investment methods"
          options={options}
          placeholder="Investment methods"
          width={8}
        />
        <Form.Field
          style={{ height: 38, marginTop: 23 }}
          control={Button}
          type="button"
          color="red"
          icon="trash"
          width={2}
          onClick={this.onDeleteClick}
        />
      </Form.Group>
    );
  }
}
