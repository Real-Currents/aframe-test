const vite_env_test = {
    ...import.meta.env
}

console.log("VITE ENV TEST: ", vite_env_test);

const aws_config = {
    "aws_project_region": `${import.meta.env.VITE_REGION}`,
    "aws_user_pools_id": "us-east-1_QeA4600FA",
    "aws_user_pools_web_client_id": "5eusi16g0o2q1g1rr5ehgudodm",
    "aws_cognito_domain": "authcori.auth.us-east-1.amazoncognito.com",
    "aws_cognito_region": "us-east-1",
    "aws_cognito_identity_pool_id": "us-east-1:2194a76a-fa3d-4c33-999e-e3c4b2b049ee",
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_username_attributes": [
        "EMAIL",
        "OPENID"
    ],
    "aws_cognito_verification_mechanisms": [
        "EMAIL",
        "OPENID"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_NUMBERS",
            "REQUIRES_LOWERCASE",
            "REQUIRES_UPPERCASE",
            "REQUIRES_SYMBOLS"
        ]
    },
    "Auth": {
        "domain": `${import.meta.env.VITE_COGNITO_DOMAIN}`,
        "clientId": `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`,
        "identityPoolId": `${import.meta.env.VITE_IDENTITY_POOL_ID}`,
        "identityPoolRegion": `${import.meta.env.VITE_REGION}`,
        "region": `${import.meta.env.VITE_REGION}`,
        // "userPoolClientId": `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`,
        "userPoolId": `${import.meta.env.VITE_USER_POOL_ID}`,
        "userPoolWebClientId": `${import.meta.env.VITE_USER_POOL_CLIENT_ID}`,
        "oauth": {
            "domain": `${import.meta.env.VITE_COGNITO_DOMAIN}`,
            // "scope": [ "email", "profile", "openid", "aws.cognito.signin.user.admin" ],
            // "scope": [ "email", "openid", "profile" ],
            // "scope": [ "email" ],
            "scope": [ "openid" ],
            "redirectSignIn": window.location.protocol + "//" + window.location.hostname + ((!!window.location.port) ? ":" + window.location.port : "" ), //`${import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN}`,
            "redirectSignOut": window.location.protocol + "//" + window.location.hostname + ((!!window.location.port) ? ":" + window.location.port : "" ) + "/", // `${import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT}`,
            "responseType": ("code" as "code") // or "token", note that REFRESH token will only
                                    // be generated when the responseType is "code"
        }
    }
};

console.log(aws_config);

export default aws_config;
