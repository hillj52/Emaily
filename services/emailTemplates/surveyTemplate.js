const { redirectDomain } = require('../../config/keys');

module.exports = survey => {
    return `
        <html>
            <body>
                <main style="text-align: center;">
                    <h3>I'd like your input!</h3>
                    <p>Please answer the following question:</p>
                    <p>${survey.body}</p>
                    <a href="${redirectDomain}/api/surveys/${survey.id}/yes">Yes</a>
                    <a href="${redirectDomain}/api/surveys/${survey.id}/no">No</a>
                </main>
            </body>
        </html>
    `;
};