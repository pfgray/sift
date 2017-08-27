import React from 'react';

export default function({bucket}) {
    const eventsUrl = `/api/bucket${bucket.id}/events`;
    return (
      <div>
        <div className="bucket">
          <span className="name">{bucket.name}</span>
        </div>
        <div className="code-block">
          <div className="code-label">Api key:</div>
          <div><code>{bucket.apiKey}</code></div>
        </div>
        <div className="code-block">
          <div className="code-label">Events endpoint:</div>
          <div><code>{eventsUrl}</code></div>
        </div>
        <div className="code-block">
          <div className="code-label">Sample curl:</div>
          <div><code>curl -X POST \<br />
              &nbsp;&nbsp;{eventsUrl} \<br />
              &nbsp;&nbsp;-H "Authorization: {bucket.apiKey}" \<br />
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
              &nbsp;&nbsp;--data @/path/to/event.json
          </code></div>
        </div>
      </div>
    );
  };

