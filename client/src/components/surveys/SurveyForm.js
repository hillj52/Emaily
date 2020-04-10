import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';
import SurveyField from './SurveyField';
import { Link, withRouter } from 'react-router-dom';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';
import * as actions from '../../actions';
import { connect } from 'react-redux';

class SurveyForm extends Component {
    render() {
        const reviewMode = this.props.reviewMode;
        return (
            <section>
                {reviewMode && <h5>Please confirm your entries!</h5>}
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields(reviewMode)}
                    {this.renderBackButton(reviewMode)}
                    {this.renderNextButton(reviewMode)}
                </form>
            </section>
        );
    }

    renderNextButton(reviewMode) {
        const text = reviewMode ? 'Send Survey' : 'Next';
        const icon = reviewMode ? 'email' : 'done';
        const { submitSurvey, formValues, history } = this.props;
        return (
            <button
                onClick={reviewMode ? () => submitSurvey(formValues, history) : undefined} 
                type="submit" 
                className="teal btn-flat right white-text"
            >
                {text}
                <i className="material-icons right">{icon}</i>
            </button>
        );
    }

    renderBackButton(reviewMode) {
        const text = reviewMode ? 'Back' : 'Cancel';
        const icon = reviewMode ? 'arrow_back' : 'cancel';
        if (reviewMode) {
            return (
            <button type="cancel" className="red btn-flat white-text"> 
                {text} 
                <i className="material-icons right">{icon}</i>
            </button>
            );
        }
        return (    
            <Link to="/surveys" className="red btn-flat white-text"> 
                {text} 
                <i className="material-icons right">{icon}</i>
            </Link>
        );
    }

    renderFields(reviewMode) {
        return _.map(formFields, field => this.renderField(field, reviewMode));
    }

    renderField({ label, name }, reviewMode) {
        return (
            <Field
                key={name}
                label={label}
                type="text"
                name={name}
                component={SurveyField}
                reviewMode={reviewMode}
            />
        );
    }
}

function validate(values) {
    const errors = {};

    errors.recipients = validateEmails(values.recipients || '');

    _.each(formFields, ({ name, label, required}) => {
        if(required && !values[name]) {
            errors[name] = label + ' is required'
        }
    });

    return errors;
}

function mapStateToProps(state) {
    return { formValues: state.form.surveyForm.values };
}

export default reduxForm({
    validate,
    form: 'surveyForm'
})(connect(mapStateToProps, actions)(withRouter(SurveyForm)));