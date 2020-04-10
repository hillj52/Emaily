import React from 'react';

export default ({ input, label, required, reviewMode, meta: { error, touched } }) => {
    return (
        <section>
            <label>{!required && <span className="red-text">*</span>}{label}</label>
            <input {...input} style={{ marginBottom: '5px' }} readOnly={reviewMode} />
            <aside className="red-text" style={{ marginBottom: '20px' }}>{touched && error}</aside>
            
        </section>
    );
}