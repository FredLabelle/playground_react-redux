import PropTypes from 'prop-types';
import { Component } from 'react';
import { Button, Progress, Image, Segment } from 'semantic-ui-react';
import uploadcare from 'uploadcare-widget';

import { FilePropType } from '../../lib/prop-types';

const File = ({ file: { name, url, image }, processed }) =>
  image
    ? <Image src={url} alt={name} size="medium" centered />
    : <Segment basic textAlign="center">
        {processed
          ? <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
          : <p>{name}</p>}
      </Segment>;
File.propTypes = {
  file: FilePropType.isRequired,
  processed: PropTypes.bool.isRequired,
};

export default class extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    file: FilePropType.isRequired,
    mutation: PropTypes.func.isRequired,
    mutationName: PropTypes.string.isRequired,
    imagesOnly: PropTypes.bool.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    imagesOnly: false,
    tabs: ['file', 'gdrive', 'dropbox', 'url'],
  };
  state = {
    progress: 1,
    file: this.props.file,
    processed: true,
  };
  componentWillReceiveProps({ file }) {
    if (!file.image && file.url !== this.state.file.url) {
      this.setState({ file, processed: true });
    }
  }
  onUploadClick = event => {
    event.preventDefault();
    const dialog = uploadcare.openDialog(null, {
      imagesOnly: this.props.imagesOnly,
      tabs: this.props.tabs,
    });
    dialog.done(file => {
      file.progress(({ progress }) => {
        // console.log(progress, uploadProgress);
        this.setState({ progress });
      });
      file.done(async ({ name, cdnUrl, originalImageInfo }) => {
        const fileState = {
          name,
          url: cdnUrl,
          image: !!originalImageInfo,
        };
        this.setState({ file: fileState, processed: false });
        const { data } = await this.props.mutation({
          field: this.props.field,
          file: fileState,
        });
        if (data[this.props.mutationName]) {
          console.info('UPDATE FILE SUCCESS');
        } else {
          console.error('UPDATE FILE ERROR');
        }
      });
      file.fail(() => {
        this.setState({ progress: 1 });
      });
    });
  };
  onDeleteClick = async event => {
    event.preventDefault();
    const file = { name: '', url: '', image: false };
    this.setState({ file });
    const { data } = await this.props.mutation({
      field: this.props.field,
      file,
    });
    if (data[this.props.mutationName]) {
      console.info('DELETE FILE SUCCESS');
    } else {
      console.error('UPDATE FILE ERROR');
    }
  };
  uploading = () => this.state.progress < 1;
  render() {
    return (
      <div>
        <div className="fields">
          <div className="field" style={{ width: '100%' }}>
            <label htmlFor="image">{this.props.label}</label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="button"
                primary
                disabled={this.uploading()}
                content={this.uploading() ? 'Uploading…' : 'Upload'}
                icon={`${this.uploading() ? 'cloud ' : ''}upload`}
                labelPosition="left"
                onClick={this.onUploadClick}
              />
              <Button
                type="button"
                color="red"
                disabled={this.uploading() || this.state.file.url === ''}
                content="Delete"
                icon="trash"
                labelPosition="left"
                onClick={this.onDeleteClick}
              />
            </div>
          </div>
        </div>
        {this.uploading()
          ? <Progress percent={this.state.progress * 100} indicating />
          : this.state.file.url && <File file={this.state.file} processed={this.state.processed} />}
      </div>
    );
  }
}
