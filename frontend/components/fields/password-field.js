import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Message } from 'semantic-ui-react';

import { FormPropType } from '../../lib/prop-types';
import { setPasswordTooWeak, setPasswordsMismatch } from '../../actions/form';

const PasswordInput = ({ value, onChange, width }) =>
  <Form.Input
    name="password"
    value={value}
    onChange={onChange}
    label="Password"
    placeholder="Password"
    type="password"
    required
    width={width}
  />;
PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

const RepeatPasswordInput = ({ value, onChange, width }) =>
  <Form.Input
    name="repeatPassword"
    value={value}
    onChange={onChange}
    label="Repeat password"
    placeholder="Repeat Password"
    type="password"
    required
    width={width}
  />;
RepeatPasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

class PasswordField extends Component {
  static propTypes = {
    grouped: PropTypes.bool,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    form: FormPropType.isRequired,
    setPasswordTooWeak: PropTypes.func.isRequired,
    setPasswordsMismatch: PropTypes.func.isRequired,
  };
  static defaultProps = { grouped: false };
  state = { repeatPassword: '' };
  componentWillUnmount() {
    this.props.setPasswordTooWeak(false);
    this.props.setPasswordsMismatch(false);
  }
  passwordsMismatch = (password, repeatPassword) => {
    const result = password && repeatPassword && password !== repeatPassword;
    return !!result;
  };
  passwordTooWeak = password => {
    if (password.length < 8) {
      return true;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonAlphas = /\W/.test(password);
    const passwordStrongEnough = hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas;
    return !passwordStrongEnough;
  };
  handleChange = (event, { name, value }) => {
    if (name === 'password') {
      this.props.onChange(null, { name: this.props.name, value });
    } else {
      this.setState({ repeatPassword: value });
    }
    const password = name === 'password' ? value : this.props.value;
    const repeatPassword = name === 'repeatPassword' ? value : this.state.repeatPassword;
    this.props.setPasswordTooWeak(this.passwordTooWeak(password));
    this.props.setPasswordsMismatch(this.passwordsMismatch(password, repeatPassword));
  };
  render() {
    return (
      <div>
        {this.props.grouped
          ? <Form.Group>
              <PasswordInput value={this.props.value} onChange={this.handleChange} width={8} />
              <RepeatPasswordInput
                value={this.state.repeatPassword}
                onChange={this.handleChange}
                width={8}
              />
            </Form.Group>
          : <div>
              <PasswordInput value={this.props.value} onChange={this.handleChange} width={16} />
              <RepeatPasswordInput
                value={this.state.repeatPassword}
                onChange={this.handleChange}
                width={16}
              />
            </div>}
        {this.props.form.passwordTooWeak &&
          <Message error>
            <Message.Header>Password too weak</Message.Header>
            <Message.Content>
              Password must be at least 8 characters in length and must contain:
            </Message.Content>
            <Message.List
              items={[
                'a minimum of 1 lower case letter [a-z] and',
                'a minimum of 1 upper case letter [A-Z] and',
                'a minimum of 1 numeric character [0-9] and',
                'a minimum of 1 special character: ~`!@#$%^&*()-_+={}[]|\\;:"<>,./?',
              ]}
            />
          </Message>}
        {!this.props.form.passwordTooWeak &&
          this.props.form.passwordsMismatch &&
          <Message
            error
            header="Password mismatch"
            content="Please double-check the passwords are matching."
          />}
      </div>
    );
  }
}

export default connect(({ form }) => ({ form }), { setPasswordTooWeak, setPasswordsMismatch })(
  PasswordField,
);
