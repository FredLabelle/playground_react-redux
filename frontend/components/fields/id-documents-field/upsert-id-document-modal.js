import PropTypes from 'prop-types';
import { Component } from 'react';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';

import { handleChange, omitDeep } from '../../../lib/util';
import { IdDocumentPropType } from '../../../lib/prop-types';
import DateField from '../date-field';
import FilesField from '../files-field';

const initialState = ({ idDocument }) => ({
  idDocument,
  uploading: false,
  typeError: false,
});

export default class extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    idDocument: IdDocumentPropType.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  state = initialState(this.props);
  componentWillReceiveProps(nextProps) {
    this.setState(initialState(nextProps));
  }
  onCancel = () => {
    this.setState(initialState(this.props));
    this.props.onClose();
  };
  onSubmit = async event => {
    event.preventDefault();
    if (!this.props.idDocument.id) {
      const typeError = !this.state.idDocument.type;
      this.setState({ typeError });
      if (typeError) {
        return;
      }
    }
    const idDocument = omitDeep(this.state.idDocument, '__typename');
    this.props.onChange(idDocument);
    this.onCancel();
  };
  onUploadingChange = uploading => {
    this.setState({ uploading });
  }
  handleChange = handleChange().bind(this);
  render() {
    const typesOptions = [
      {
        key: 'id-card',
        text: 'ID card',
        value: 'id-card',
      },
      {
        key: 'passport',
        text: 'Passport',
        value: 'passport',
      },
    ];
    return (
      <Modal
        closeOnEscape={false}
        open={this.props.open}
        onClose={this.onCancel}
        size="small"
      >
        <Header
          icon="id card outline"
          content={this.props.idDocument.id ? 'Edit an ID document' : 'Add a new ID document'}
        />
        <Modal.Content>
          <Form id="upsert-id-document" onSubmit={this.onSubmit} error={this.state.typeError}>
            <Form.Select
              name="idDocument.type"
              defaultValue={this.state.idDocument.type}
              onChange={this.handleChange}
              options={typesOptions}
              label="ID type"
              placeholder="ID type"
              required
            />
            <Form.Input
              name="idDocument.number"
              value={this.state.idDocument.number}
              onChange={this.handleChange}
              label="ID number"
              placeholder="ID number"
              required
            />
            <DateField
              name="idDocument.expirationDate"
              value={this.state.idDocument.expirationDate}
              onChange={this.handleChange}
              label="Expiration date"
            />
            <FilesField
              name="idDocument.files"
              value={this.state.idDocument.files}
              onChange={this.handleChange}
              label="Files"
              onUploadingChange={this.onUploadingChange}
            />
            <Message error header="Error!" content="Type is required!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            onClick={this.onCancel}
            content="Cancel"
            icon="remove"
            labelPosition="left"
          />
          <Button
            type="submit"
            form="upsert-id-document"
            primary
            disabled={this.state.uploading}
            content={this.props.idDocument.id ? 'Edit' : 'Add'}
            icon="checkmark"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
