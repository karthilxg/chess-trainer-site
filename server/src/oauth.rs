use crate::config::Config;
use crate::guards::HostHeader;
use anyhow;
use oauth2::basic::BasicClient;
use oauth2::reqwest::async_http_client;
use oauth2::{
    AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge, RedirectUrl,
    TokenResponse, TokenUrl,
};
use rocket::response::Redirect;
use rocket::serde::{json::Json, Deserialize, Serialize};
use rocket::State;

fn get_oauth_client(host: &HostHeader) -> BasicClient {
    let client = BasicClient::new(
        ClientId::new("client_id".to_string()),
        Some(ClientSecret::new("client_secret".to_string())),
        AuthUrl::new("https://lichess.org/oauth".to_string()).unwrap(),
        Some(TokenUrl::new("https://lichess.org/api/token".to_string()).unwrap()),
    )
    .set_redirect_uri(
        // TODO: should use https when appropriate
        RedirectUrl::new(format!("http://{}/lichess_oauth_success", host.0)).unwrap(),
    );
    return client;
}

#[derive(Serialize)]
pub struct UrlResponse {
    url: String,
}

#[rocket::get("/auth/lichess/login")]
pub fn lichess_login(config: &State<Config>, host: HostHeader) -> Redirect {
    // Generate a PKCE challenge.
    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    // Generate the full authorization URL.
    let (auth_url, csrf_token) = get_oauth_client(&host)
        .authorize_url(CsrfToken::new_random)
        // Set the desired scopes.
        // .add_scope(Scope::new("read".to_string()))
        // Set the PKCE code challenge.
        .set_pkce_challenge(pkce_challenge)
        .url();
    return Redirect::to(auth_url.to_string());
}

// #[derive(Deserialize, Serialize, Debug)]
// pub struct LichessOauthRequest {
//     auth_code: String,
// }

#[rocket::get("/auth/lichess/authenticate")]
pub async fn lichess_callback(config: &State<Config>, host: HostHeader) -> Redirect {
    // Now you can trade it for an access token.
    let token_result = get_oauth_client(&host)
        .exchange_code(AuthorizationCode::new(
            "some authorization code".to_string(),
        ))
        // Set the PKCE code verifier.
        // .set_pkce_verifier(pkce_verifier)
        .request_async(async_http_client)
        .await;
    // TODO: fix this to not unwrap
    println!(
        "Token  result is {:?}",
        token_result.unwrap().access_token()
    );
    Redirect::to("/")
}
