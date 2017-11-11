import React from 'react';

/**
 * A Higher Order component which maintains scrollback state.
 */
const withFetch = promiseGenerator => WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        resolved: false,
        data: null,
        err: null
      };
    }
    componentDidMount() {
      promiseGenerator(this.props)
        .then(result => this.setState({resolved: true, data: result}))
        .catch(err => this.setState({resolved: true, err}))
    }
    refetch() {
      this.setState({resolved: false});
      promiseGenerator(this.props)
        .then(result => this.setState({resolved: true, data: result}))
        .catch(err => this.setState({resolved: true, err}))
    }
    render() {
      return <WrappedComponent {...this.state} {...this.props} refetch={this.refetch.bind(this)} />;
    }
  };
}

export default withFetch;
