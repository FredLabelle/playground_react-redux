import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

const InvitationEmailFields = ({ invitationEmail, handleChange }) =>
  <div>
    <Form.Input
      name="invitationEmail.subject"
      value={invitationEmail.subject}
      onChange={handleChange}
      label="Subject"
      placeholder="Subject"
      required
    />
    <Form.TextArea
      name="invitationEmail.body"
      defaultValue={invitationEmail.body}
      onChange={handleChange}
      label="Body"
      placeholder="Body"
      required
      autoHeight
    />
    <p>
      You can use <strong>{'{{organization}}'}</strong>, <strong>{'{{firstname}}'}</strong>,{' '}
      <strong>{'{{lastname}}'}</strong> and <strong>{'{{signup_link}}'}</strong>.
    </p>
  </div>;
InvitationEmailFields.propTypes = {
  invitationEmail: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InvitationEmailFields;
