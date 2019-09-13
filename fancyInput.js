'use strict';

class FancyInput extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var value = event.target.value;
        if (this.props.onChange) {
            return this.props.onChange(value);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label>{this.props.label}</label>
                <div className="input-group">
                    {this.props.prepend && (
                        <div className="input-group-prepend">
                            {this.props.prepend}
                        </div>
                    )}

                    <input type={this.props.type} required={this.props.required} min={this.props.min} max={this.props.max} step={this.props.step} value={this.props.value} onChange={this.handleChange}/>

                    {this.props.append && (
                        <div className="input-group-append">
                            {this.props.append}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
