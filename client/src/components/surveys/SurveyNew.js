import React, { Component } from 'react';
import SurveyForm from './SurveyForm';

class SurveyNew extends Component {
    state = { reviewMode: false };

    render() {
        return (
            <section>
                <SurveyForm 
                    reviewMode={this.state.reviewMode} 
                    onSurveySubmit={() => this.setState({ reviewMode: !this.state.reviewMode })}
                    onCancel={() => this.setState({ reviewMode: !this.state.reviewMode })}
                />
            </section>
        );
    }
}

export default SurveyNew;