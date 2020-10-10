# OneLine-Pro-Upgrade-Backend
Backend for the OneLine Pro Upgrade. This webapp will upgrade a user of OneLine to OneLine Pro.

## Error Response

To qualify an error, the response MUST have a `4xx`/`5xx`-level HTTP status code, and MUST include the `error` field which consists of an [error object](Errors.md#error-object). E.g.:

```
POST -> api/v1/signup/
```
--
```
412 Precondition Failed
```
```
{
    "error": {
        "type": "onelineApiError",
        "message": "The request parameters that have been received by the server are invalid.",
        "errCode": 701,
        "httpCode": 412
    }
}
```

## Errors

The OneLine API returns a number of different errors. The HTTP response status code will be in accordance with the [W3 Status Code Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html); however, the response data will include internal status codes which are detailed below:

Code | Message | HTTP code | Description | Reference
---- | ------- | --------- | ----------- | ---------  
300 | Your request could not be completed because it was not properly authenticated. | 401 | Something was wrong with the authentication method for this request. | [Request Authentication](Authentication/RequestAuthentication.md)
301 | A valid access token is required to access this resource. | 401 | | [Request Authentication](Authentication/RequestAuthentication.md)
302 | You must be authenticated as a user to take this action. | 401 | Identity required to make this request. | [User Authentication](Authentication/OAuthAuthentication.md), [Request Authentication](Authentication/RequestAuthentication.md)
310 | The provided access token is invalid, or cannot be used with the provided parameters. | 401 | Invalid or expired [Access Token](Authentication/OAuthAuthentication/AccessToken.md) provided. | [User Authentication](Authentication/OAuthAuthentication.md), [Access Token](Authentication/OAuthAuthentication/AccessToken.md)
311 | The provided refresh token is invalid, or cannot be used with the provided parameters. | 400 | Invalid Refresh Token provided. | [User Authentication](Authentication/OAuthAuthentication.md), [Access Token](Authentication/OAuthAuthentication/AccessToken.md)
312 | The provided access token or refresh token does not match the given bearer token. | 401 | Mismatched API Key provided when refreshing token. | [User Authentication](Authentication/OAuthAuthentication.md)
320 | The provided refresh token cannot be used to renew an access token. Client login should be attempted. | 403 | | [User Authentication](Authentication/OAuthAuthentication.md)
700 | The requested operation is not permitted on this resource. | 412 | A precondition was not met for this request. | 
701 | The request parameters that have been received by the server are invalid | 412 | A precondition was not met for this request. |
702 | The email provided already exists in the database. | 412 | A precondition was not met for this request. |


