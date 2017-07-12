import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

const Moment = moment().constructor;

const DatePicker = ({ date, onDateChange, focused, onFocusChange }) =>
  <SingleDatePicker
    date={date}
    onDateChange={onDateChange}
    focused={focused}
    onFocusChange={onFocusChange}
    showDefaultInputIcon
    displayFormat="DD/MM/YYYY"
  />;
DatePicker.propTypes = {
  date: PropTypes.instanceOf(Moment).isRequired,
  onDateChange: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  onFocusChange: PropTypes.func.isRequired,
};

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    width: PropTypes.number,
  };
  static defaultProps = { label: 'Date', width: 16 };
  state = { focused: false };
  onFocusChange = ({ focused }) => {
    this.setState({ focused });
  };
  handleChange = value => {
    this.props.onChange(null, { name: this.props.name, value: value.format('DD-MM-YYYY') });
  };
  render() {
    return (
      <Form.Field
        label={this.props.label}
        width={this.props.width}
        control={DatePicker}
        date={moment(this.props.value, 'DD-MM-YYYY')}
        onDateChange={this.handleChange}
        focused={this.state.focused}
        onFocusChange={this.onFocusChange}
      />
    );
  }
}
