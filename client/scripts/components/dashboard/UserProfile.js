'use strict';

var React = require('react/addons');

var UserProfile = React.createClass({
  render: function() {
    return (
      <div>
        <div className="user">
          <img src={this.props.user.picture} />
          <span className="name">{this.props.user.displayName}</span>
        </div>
        <div className="code-block">
          <div className="code-label">Api key:</div>
          <div><code>{this.props.user.apiKey}</code></div>
        </div>
        <div className="code-block">
          <div className="code-label">Events endpoint:</div>
          <div><code>{this.props.user.eventsUrl}</code></div>
        </div>
        <div className="code-block">
          <div className="code-label">Sample curl:</div>
          <div><code>curl -X POST \<br />
              &nbsp;&nbsp;{this.props.user.eventsUrl} \<br />
              &nbsp;&nbsp;-H "Authorization: {this.props.user.apiKey}" \<br />
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
              &nbsp;&nbsp;--data @/path/to/event.json
          </code></div>
        </div>
      </div>
    );
  }
});

module.exports = UserProfile;
