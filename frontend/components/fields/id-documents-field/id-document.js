import PropTypes from 'prop-types';
import { Component } from 'react';
import { Grid, List, Button } from 'semantic-ui-react';

import { IdDocumentPropType } from '../../../lib/prop-types';
import UpsertIdDocumentModal from './upsert-id-document-modal';

const typeToText = type => {
  switch (type) {
    case 'id-card': {
      return 'ID card';
    }
    case 'passport': {
      return 'Passport';
    }
    default: {
      return '';
    }
  }
};

export default class extends Component {
  static propTypes = {
    idDocument: IdDocumentPropType.isRequired,
    onEditIdDocument: PropTypes.func.isRequired,
    onDeleteIdDocument: PropTypes.func.isRequired,
  };
  state = { upsertIdDocumentModalOpen: false };
  onUpsertIdDocumentModalClose = () => {
    this.setState({ upsertIdDocumentModalOpen: false }, () => {
      document.body.classList.add('dimmable', 'dimmed', 'scrolling');
    });
  };
  updateIdDocument = event => {
    event.preventDefault();
    this.setState({ upsertIdDocumentModalOpen: true });
  };
  render() {
    const { idDocument, onEditIdDocument, onDeleteIdDocument } = this.props;
    return (
      <Grid.Row>
        <Grid.Column width={5}>
          {idDocument.number} ({typeToText(idDocument.type)})
        </Grid.Column>
        <Grid.Column width={5}>
          <List>
            {idDocument.files.map(file =>
              <List.Item
                key={file.url}
                as={file.uploaded ? 'a' : 'span'}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </List.Item>,
            )}
          </List>
        </Grid.Column>
        <Grid.Column width={6}>
          <Button
            type="button"
            primary
            content="Edit"
            icon="edit"
            labelPosition="left"
            onClick={this.updateIdDocument}
          />
          <Button
            type="button"
            color="red"
            content="Delete"
            icon="remove"
            labelPosition="left"
            onClick={onDeleteIdDocument(idDocument)}
          />
        </Grid.Column>
        <UpsertIdDocumentModal
          open={this.state.upsertIdDocumentModalOpen}
          onClose={this.onUpsertIdDocumentModalClose}
          idDocument={idDocument}
          onChange={onEditIdDocument}
        />
      </Grid.Row>
    );
  }
}
