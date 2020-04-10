import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveyTotals } from '../../actions';

class SurveyCard extends Component {
    componentDidMount() {
        this.props.fetchSurveyTotals(this.props.surveyId);
        if (this.props.surveyTotals === []) {
            this.props.dataLoaded = false;
        } 
    }

    render() {
        return (
            <div className="card darken-1" key={this.props.surveyId}>
                <div className="card-content">
                    <span className="card-title">{this.props.surveyTitle}</span>
                    <p>
                        {this.props.surveyBody}
                    </p>
                    <p>
                        Sent on: {this.props.dateSent}
                    </p>
                    {this.renderDataDiv()}
                </div>
            </div>    
        );
    }

    renderDataDiv() {
        if (this.props.dataLoaded) {
            return (
            <div className="card-action">
                <a href="#">Yes: {this.props.surveyTotals.yes}</a>
                <a href="#">No: {this.props.surveyTotals.no}</a>
            </div>);
        }
        return (
            <div className="card-action">
                <a href="#">Yes: ...</a>
                <a href="#">No: ...</a>
            </div>
        )
    }
}

function mapStateToProps({ surveyTotals }, ownProps) {
    const data = surveyTotals[ownProps.surveyId];
    if (data) {
        ownProps.dataLoaded = true;
        return {
            surveyId: ownProps.surveyId,
            surveyTotals: {
                yes: data.data.yes,
                no: data.data.no
            }
        };
    }
    return { surveyTotals };
}

export default connect(mapStateToProps, { fetchSurveyTotals })(SurveyCard);