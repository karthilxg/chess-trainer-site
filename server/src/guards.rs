use crate::config;
use crate::endpoint_types::ServerError;
use rocket::{
    http::Status,
    request::{FromRequest, Outcome},
    Request, State,
};

macro_rules! requestGuard {
    ($l:ident, $header:expr) => {
        #[derive(Debug, Clone)]
        pub struct $l(pub String);

        #[rocket::async_trait]
        impl<'a> FromRequest<'a> for $l {
            type Error = ServerError;

            async fn from_request(request: &'a Request<'_>) -> Outcome<Self, Self::Error> {
                let host = request.headers().get_one($header);
                match host {
                    Some(host) => {
                        // check validity
                        Outcome::Success($l(host.to_string()))
                    }
                    // token does not exist
                    None => Outcome::Failure((
                        Status::BadRequest,
                        ServerError::HeaderNotFound($header.to_string()),
                    )),
                }
            }
        }
    };
}

requestGuard!(HostHeader, "host");
requestGuard!(UserAgentHeader, "user-agent");
requestGuard!(OriginHeader, "origin");
requestGuard!(StripeSignature, "stripe-signature");
