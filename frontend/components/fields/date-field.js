import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    width: PropTypes.number,
  };
  static defaultProps = { label: 'Date', width: 16 };
  state = { value: moment(this.props.value) };
  componentDidMount() {
    const inputContainers = [...document.querySelectorAll('.react-datepicker__input-container')];
    inputContainers.forEach(inputContainer => {
      const { style } = inputContainer;
      style.width = '100%';
    });
  }
  componentWillReceiveProps({ value }) {
    this.setState({ value: moment(value) });
  }
  handleChange = value => {
    this.props.onChange(null, { name: this.props.name, value: value.toDate().toJSON() });
  };
  render() {
    return (
      <Form.Field
        label={this.props.label}
        width={this.props.width}
        control={DatePicker}
        dateFormat="DD-MM-YYYY"
        showMonthDropdown
        showYearDropdown
        selected={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}
