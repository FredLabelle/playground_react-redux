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
    isOutsideRange={() => false}
  />;
DatePicker.propTypes = {
  date: PropTypes.instanceOf(Moment),
  onDateChange: PropTypes.func.isRequired,
  focused: PropTypes.bool,
  onFocusChange: PropTypes.func.isRequired,
};
DatePicker.defaultProps = { date: null, focused: false };

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    width: PropTypes.number,
  };
  static defaultProps = { value: '', label: 'Date', width: 16 };
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
        date={this.props.value ? moment(this.props.value, 'DD-MM-YYYY') : null}
        onDateChange={this.handleChange}
        focused={this.state.focused}
        onFocusChange={this.onFocusChange}
      />
    );
  }
}
