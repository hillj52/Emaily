import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';
import SurveyCard from './SurveyCard';

class SurveyList extends Component {
    componentDidMount() {
        this.props.fetchSurveys();
    }

    renderSurveys() {
        return this.props.surveys.reverse().map(survey => {
            return (
                <SurveyCard 
                    key={survey._id}
                    surveyId={survey._id}
                    surveyTitle={survey.title}
                    surveyBody={survey.body}
                    dateSent={new Date(survey.dateSent).toLocaleDateString()}
                />
            );
        });
    }

    render() {
        return (
            <section>
                {this.renderSurveys()}
            </section>
        );
    }
}

function mapStateToProps({ surveys }) {
    return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);