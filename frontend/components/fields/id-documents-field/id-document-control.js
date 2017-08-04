import PropTypes from 'prop-types';
import { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';

import { IdDocumentPropType } from '../../../lib/prop-types';
import UpsertIdDocumentModal from './upsert-id-document-modal';
import IdDocument from './id-document';

export default class extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(IdDocumentPropType).isRequired,
    onAddIdDocument: PropTypes.func.isRequired,
    onEditIdDocument: PropTypes.func.isRequired,
    onDeleteIdDocument: PropTypes.func.isRequired,
  };
  state = { upsertIdDocumentModalOpen: false };
  onUpsertIdDocumentModalClose = () => {
    this.setState({ upsertIdDocumentModalOpen: false }, () => {
      document.body.classList.add('dimmable', 'dimmed', 'scrolling');
    });
  };
  createIdDocument = event => {
    event.preventDefault();
    this.setState({ upsertIdDocumentModalOpen: true });
  };
  render() {
    return (
      <div>
        {this.props.value.length > 0 &&
          <Grid>
            {this.props.value.map(idDocument =>
              <IdDocument
                key={idDocument.id}
                idDocument={idDocument}
                onEditIdDocument={this.props.onEditIdDocument}
                onDeleteIdDocument={this.props.onDeleteIdDocument}
              />,
            )}
          </Grid>}
        <Button
          type="button"
          primary
          content="Add an ID document"
          icon="id card outline"
          labelPosition="left"
          onClick={this.createIdDocument}
        />
        <UpsertIdDocumentModal
          open={this.state.upsertIdDocumentModalOpen}
          onClose={this.onUpsertIdDocumentModalClose}
          idDocument={{
            type: '',
            number: '',
            expirationDate: '01-01-1970',
            files: [],
          }}
          onChange={this.props.onAddIdDocument}
        />
      </div>
    );
  }
}
