import PropTypes from 'prop-types';
import { Header, Form } from 'semantic-ui-react';

import { UserPropType, OrganizationPropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import PasswordField from '../fields/password-field';

const AccountFields = ({
  user,
  signup,
  handleChange,
  organization,
}) =>
  <div>
    <Header as="h3" dividing>
      User identity
    </Header>
    <Form.Input
      name="user.email"
      value={user.email}
      onChange={handleChange}
      label="Email"
      placeholder="Email"
      type="email"
      required
    />
    <NameField name="user.name" value={user.name} onChange={handleChange} />
    {!signup &&
      <Form.Group>
        <Form.Input
          name="user.phone1"
          value={user.phone1}
          onChange={handleChange}
          label="Phone 1"
          placeholder="Phone 1"
          type="tel"
          width={8}
        />
        <Form.Input
          name="user.phone2"
          value={user.phone2}
          onChange={handleChange}
          label="Phone 2"
          placeholder="Phone 2"
          type="tel"
          width={8}
        />
      </Form.Group>}
    {signup &&
      <PasswordField
        grouped
        name="user.password"
        value={user.password}
        onChange={handleChange}
      />}
  </div>;
AccountFields.propTypes = {
  user: UserPropType.isRequired,
  signup: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  organization: OrganizationPropType.isRequired,
};
AccountFields.defaultProps = { signup: false };

export default AccountFields;
