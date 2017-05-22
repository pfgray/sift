import React from 'react';

const ActorAttributes = [/*{
  label: 'Name',
  name: 'name'
},*/ {
  label: 'Id',
  name: 'id'
}];

var StreamFilters = React.createClass({
  getInitialState: function() {
    return {
      showFilters: false
    };
  },
  show: function(){
    this.setState(prev => {
      if(!prev.showFilters){
        // focus on textBox
        this.id.focus();
      }
      return {
        showFilters: true
      };
    });
  },
  hide: function(){
    this.setState(prev => ({
      showFilters: false
    }));
  },
  componentDidMount: function(){
    // setup document listener for cmd + k
    // setup document listener for off click
    this.shortcutListener = window.addEventListener('keydown', e => {
      if (e.metaKey && e.keyCode == 75) {
        this.state.showFilters ? this.hide() : this.show();
      }
    });
    this.shortcutListener = window.addEventListener('click', e => {
      const clickIsInContainer = this.root.contains(e.target) && this.root !== e.target;

      if (!clickIsInContainer) {
        this.hide();
      }
    });
  },
  updateVal: function(name) {
    return e => {
      this.props.onFilterUpdate({
        ...this.props.filters,
        [name]: e.target.value
      });
    };
  },
  updateType: function(type) {
    return e => {
      this.props.onFilterUpdate({
        ...this.props.filters,
        types: {
          ...this.props.filters.types,
          [type]: e.target.checked
        }
      });
    };
  },
  typeIsVisible: function(type){
    return this.props.filters.types[type] === true;
  },
  filtersActive: function(){
    const actorFiltersActive = this.props.filters.name !== '' || this.props.filters.id !== '';
    const eventFiltersActive = Object.keys(this.props.filters.types).some(t => !this.props.filters.types[t]);
    return actorFiltersActive || eventFiltersActive;
  },
  render: function() {
    return (
      <div className={"stream-filters" + (this.state.showFilters ? ' open' : '')} ref={node => this.root = node}>
        <div className="filters-collapse">
          <div className="filter-section">
            <div>Actor</div>
            {ActorAttributes.map(attr => (
              <label key={attr.name} className="filter-text">
                {attr.label}
                <input
                  type="text"
                  name={attr.name}
                  value={this.props.filters[attr.name]}
                  onChange={this.updateVal(attr.name)}
                  ref={node => this[attr.name] = node}/>
              </label>
            ))}
          </div>
          <div className="filter-section">
            <div>Type</div>
            {Object.keys(this.props.filters.types).map(type => (
              <label key={type} className="filter-check">
                <input type="checkbox" name={type} onChange={this.updateType(type)} checked={this.typeIsVisible(type)} />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className="filters-tab">Filters ⌘ + K {this.filtersActive() ? <span title="Active filters" className="accent">✹</span> : null}</div>
      </div>
    );
  }
});

module.exports = StreamFilters;
