import PropTypes from 'prop-types';
import { Component } from 'react';
import { Input, Select, Button, Segment, Grid, Icon } from 'semantic-ui-react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

/* <Form.Group>
  <Form.Input
    name="name"
    value={this.props.value.name}
    onChange={this.handleChange}
    label="Name"
    placeholder="Name"
    required
    width={6}
  />
  <Form.Select
    name="investmentMechanisms"
    value={this.props.value.investmentMechanisms.join(',')}
    onChange={this.handleChange}
    label="Investment mechanisms"
    options={options}
    placeholder="Investment mechanisms"
    width={8}
  />
  <Form.Field
    style={{ height: 38, marginTop: 23 }}
    control={Button}
    type="button"
    color="red"
    icon="trash"
    width={2}
    onClick={this.onDeleteClick}
  />
</Form.Group>*/

const DragHandle = SortableHandle(() =>
  <div>
    <Icon fitted name="resize vertical" />
    <Icon name="content" />
    <style jsx>{`
      div {
        text-align: center;
        cursor: row-resize;
      }
    `}</style>
  </div>,
);

class DealCategoryField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({
      name: PropTypes.string.isRequired,
      investmentMechanisms: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };
  onDeleteClick = event => {
    event.preventDefault();
    this.props.onChange(event, { name: this.props.name, value: null });
  };
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: name === 'name' ? value : value.split(','),
    };
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  render() {
    const options = [
      {
        key: 'DealByDeal',
        text: 'Deal by deal',
        value: 'DealByDeal',
      },
      {
        key: 'SystematicWithOptOut',
        text: 'Systematic with opt-out',
        value: 'SystematicWithOptOut',
      },
      {
        key: 'DealByDeal,SystematicWithOptOut',
        text: 'Deal by deal and systematic with opt-out',
        value: 'DealByDeal,SystematicWithOptOut',
      },
    ];
    return (
      <Grid>
        <Grid.Column width={2}>
          <DragHandle />
        </Grid.Column>
        <Grid.Column width={11}>
          <Segment>
            <Input
              fluid
              name="name"
              value={this.props.value.name}
              onChange={this.handleChange}
              placeholder="Name"
              required
              style={{ marginBottom: 15 }}
            />
            <Select
              fluid
              name="investmentMechanisms"
              value={this.props.value.investmentMechanisms.join(',')}
              onChange={this.handleChange}
              options={options}
              placeholder="Investment mechanisms"
            />
          </Segment>
        </Grid.Column>
        <Grid.Column width={3}>
          <Button
            // style={{ height: 38, marginTop: 23 }}
            type="button"
            color="red"
            icon="trash"
            onClick={this.onDeleteClick}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default SortableElement(DealCategoryField);
