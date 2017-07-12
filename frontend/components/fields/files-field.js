import PropTypes from 'prop-types';
import { Component } from 'react';
import { Button, Progress, Image, Segment } from 'semantic-ui-react';
import uploadcare from 'uploadcare-widget';

import { FilePropType } from '../../lib/prop-types';

const File = ({ file: { name, url, image, uploaded } }) =>
  image
    ? <Image src={url} alt={name} size="medium" centered />
    : <Segment basic textAlign="center">
        {uploaded
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
    name: PropTypes.string.isRequired,
    value: PropTypes.arrayOf(FilePropType),
    onChange: PropTypes.func,
    label: PropTypes.string.isRequired,
    imagesOnly: PropTypes.bool,
    tabs: PropTypes.arrayOf(PropTypes.string),
    crop: PropTypes.string,
    multiple: PropTypes.bool,
  };
  static defaultProps = {
    value: [],
    onChange: () => {},
    imagesOnly: false,
    tabs: ['file', 'gdrive', 'dropbox', 'url'],
    crop: 'disabled',
    multiple: false,
  };
  state = {
    progress: 1,
    value: this.props.value,
  };
  componentWillReceiveProps({ files }) {
    this.setState({ files });
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
            uploaded: false,
          });
          if (filesState.length < files.length) {
            return;
          }
          this.setState({ value: filesState });
          this.props.onChange(event, { name: this.props.name, value: filesState });
        });
      });
    });
  };
  onDeleteClick = async event => {
    event.preventDefault();
    this.setState({ value: [] });
    this.props.onChange(event, { name: this.props.name, value: [] });
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
                disabled={this.uploading() || !this.state.value.length}
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
          : this.state.value.map(file =>
              <div key={file.url} className="divider">
                <File file={file} />
              </div>,
            )}
        <style jsx>{`
          .field {
            width: 100%;
          }
          .field > div {
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
