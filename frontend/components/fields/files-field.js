import PropTypes from 'prop-types';
import { Component } from 'react';
import { Button, Progress, Image, Segment } from 'semantic-ui-react';
import uploadcare from 'uploadcare-widget';
import omit from 'lodash/omit';

import { FilePropType } from '../../lib/prop-types';

const File = ({ file: { name, url, image, processed } }) =>
  image
    ? <Image src={url} alt={name} size="medium" centered />
    : <Segment basic textAlign="center">
        {processed
          ? <a href={url} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          : <p>
              {name}
            </p>}
      </Segment>;
File.propTypes = { file: FilePropType.isRequired };

export default class extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(FilePropType).isRequired,
    onChange: PropTypes.func,
    mutation: PropTypes.func,
    mutationName: PropTypes.string,
    imagesOnly: PropTypes.bool,
    tabs: PropTypes.arrayOf(PropTypes.string),
    crop: PropTypes.string,
    multiple: PropTypes.bool,
  };
  static defaultProps = {
    onChange: () => {},
    mutation: () => {},
    mutationName: '',
    imagesOnly: false,
    tabs: ['file', 'gdrive', 'dropbox', 'url'],
    crop: 'disabled',
    multiple: false,
  };
  state = {
    progress: 1,
    files: this.props.files.map(file => ({ ...file, processed: true })),
  };
  componentWillReceiveProps({ files }) {
    if (files.length !== this.state.files.length) {
      this.setState({ files: files.map(file => ({ ...file, processed: true })) });
      return;
    }
    const filesState = files.map((file, index) => {
      const fileState = { ...this.state.files[index] };
      if (!file.image && file.url !== fileState.url) {
        return { ...file, processed: true };
      }
      return fileState;
    });
    this.setState({ files: filesState });
  }
  onUploadClick = event => {
    event.preventDefault();
    const [tab] = this.props.tabs;
    const dialog = uploadcare.openDialog(null, tab, {
      imagesOnly: this.props.imagesOnly,
      tabs: this.props.tabs,
      crop: this.props.crop,
      multiple: this.props.multiple,
    });
    dialog.done(result => {
      const promise = this.props.multiple ? result.promise() : result;
      promise.progress(({ progress }) => {
        this.setState({ progress });
      });
      promise.fail(() => {
        this.setState({ progress: 1 });
      });
      const files = this.props.multiple ? result.files() : [result];
      const filesState = [];
      files.forEach(file => {
        file.done(async ({ name, cdnUrl, originalImageInfo }) => {
          filesState.push({
            name,
            url: cdnUrl,
            image: !!originalImageInfo,
            processed: false,
          });
          if (filesState.length < files.length) {
            return;
          }
          this.setState({ files: filesState });
          const value = filesState.map(fileState => omit(fileState, 'processed'));
          this.props.onChange(null, { name: this.props.field, value });
          if (!this.props.mutationName) {
            return;
          }
          const { data } = await this.props.mutation({
            field: this.props.field,
            files: value,
          });
          if (data[this.props.mutationName]) {
            console.info('UPDATE FILES SUCCESS');
          } else {
            console.error('UPDATE FILES ERROR');
          }
        });
      });
    });
  };
  onDeleteClick = async event => {
    event.preventDefault();
    this.setState({ files: [] });
    this.props.onChange(event, { name: this.props.field, value: [] });
    if (!this.props.mutationName) {
      return;
    }
    const { data } = await this.props.mutation({
      field: this.props.field,
      files: [],
    });
    if (data[this.props.mutationName]) {
      console.info('DELETE FILES SUCCESS');
    } else {
      console.error('UPDATE FILES ERROR');
    }
  };
  uploading = () => this.state.progress < 1;
  render() {
    return (
      <div>
        <div className="fields">
          <div className="field">
            <label htmlFor="image">
              {this.props.label}
            </label>
            <div>
              <Button
                type="button"
                primary
                disabled={this.uploading()}
                content={this.uploading() ? 'Uploading…' : 'Upload'}
                icon={this.uploading() ? 'cloud upload' : 'upload'}
                labelPosition="left"
                onClick={this.onUploadClick}
              />
              <Button
                type="button"
                color="red"
                disabled={this.uploading() || !this.state.files.length}
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
          : this.state.files.map(file =>
              <div key={file.url} className="divider">
                <File file={file} />
              </div>,
            )}
        <style jsx>{`
          .field {
            width: 100%;
          }
          .field div {
            display: flex;
            justify-content: center;
          }
          .divider {
            margin-bottom: 15px;
          }
        `}</style>
      </div>
    );
  }
}
