import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import moment from 'moment';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
  };
  static defaultProps = { label: '' };
  handleChange = (event, { name, value }) => {
    const newValue = moment(this.props.value, 'DD-MM-YYYY');
    newValue[name](value);
    this.props.onChange(event, { name: this.props.name, value: newValue.format('DD-MM-YYYY') });
  };
  render() {
    const options = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ].map((month, index) => ({
      key: month.substr(0, 3),
      text: month,
      value: index,
    }));
    const value = moment(this.props.value, 'DD-MM-YYYY');
    return (
      <Form.Group>
        <Form.Input
          name="date"
          defaultValue={value.date()}
          onChange={this.handleChange}
          label={this.props.label}
          placeholder="Day"
          type="number"
          min="1"
          max="31"
          width={5}
        />
        <Form.Select
          name="month"
          defaultValue={value.month()}
          onChange={this.handleChange}
          label={<label htmlFor="month">&nbsp;</label>}
          options={options}
          width={6}
        />
        <Form.Input
          name="year"
          defaultValue={value.year()}
          onChange={this.handleChange}
          label={<label htmlFor="year">&nbsp;</label>}
          type="number"
          min={moment().year() - 150}
          max={moment().year() + 50}
          width={5}
        />
      </Form.Group>
    );
  }
}
