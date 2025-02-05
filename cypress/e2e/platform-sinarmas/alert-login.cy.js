describe('Login Alert Test', () => {
    beforeEach(() => {
      cy.visit('https://trace-gar-dev.haratoken.app/');
    });
  
    const testCases = [
      { status: 0, message: 'Connection Refused: Unable to connect to the server. The service may be down or experiencing issues. Please try again later.', forceError: true },
      { status: 401, message: '401 - Unauthorized Access: Your request could not be processed due to missing or invalid authentication credentials. Please check your login details and try again.' },
      { status: 403, message: '403 - Forbidden: You do not have permission to access this resource. If you believe this is an error, please contact support.' },
      { status: 404, message: '404 - Not Found: The requested resource could not be found. It may have been moved or deleted.' },
      { status: 405, message: '405 - Method Not Allowed: The requested HTTP method is not supported for this resource. Please check the API documentation.' },
      { status: 408, message: '408 - Request Timeout: The server took too long to respond. Please check your network connection and try again.' },
      { status: 409, message: '409 - Conflict: The request could not be processed due to a conflict with the current state of the resource.' },
      { status: 413, message: '413 - Payload Too Large: The request body is too large. Please reduce the file size or data payload and try again.' },
      { status: 415, message: '415 - Unsupported Media Type: The server does not support the media format of the requested data.' },
      { status: 429, message: '429 - Too Many Requests: You have sent too many requests in a short period. Please slow down and try again later.' },
      { status: 500, message: '500 - Internal Server Error: An unexpected error occurred on the server. Please try again later or contact support if the issue persists.' },
      { status: 502, message: '502 - Bad Gateway: The server received an invalid response from an upstream server. Please try again later.' },
      { status: 503, message: '503 - Service Unavailable: The server is temporarily unable to handle your request. Please try again later.' },
      { status: 504, message: '504 - Gateway Timeout: The server did not receive a timely response from an upstream service.' }
    ];
  
    testCases.forEach(({ status, message, forceError }) => {
      it(`should display correct alert for status ${status}`, () => {
        cy.intercept('POST', 'https://trace-gar-stg-alb.haratoken.app/api/v1/auth/login', 
          forceError ? { forceNetworkError: true } : { statusCode: status, body: { message } }
        ).as('loginRequest');
  
        cy.get('#basic_email').type('superadmin@hara.com');
        cy.get('#basic_password').type('Test1234#');
        cy.get('.ant-btn').click();
  
        cy.wait('@loginRequest');
  
        cy.get('.ant-notification-notice')
          .should('be.visible')
          .and('contain', message);
      });
    });
  });
  