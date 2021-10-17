use log::info;
use std::error::Error;

use rocket::{http::Status, Request};
use rocket::{
    response::{self, Responder},
    Response,
};

use serde::{Deserialize, Serialize};
use thiserror::Error;

pub type EndpointResult<T> = color_eyre::Result<T, ServerError>;

#[derive(Serialize, Deserialize)]
pub struct EndpointErrorResponse {
    error_message: String,
    errors: Option<Vec<String>>,
}

impl<'r> Responder<'r, 'static> for ServerError {
    fn respond_to(self, r: &'r Request<'_>) -> response::Result<'static> {
        info!("Failing response with {:?}", self);
        info!("{:?}", self.backtrace());
        match self {
            Self::Unauthorized => Err(Status::Unauthorized),
            _ => Err(Status::InternalServerError),
        }
    }
}

#[derive(Error, Debug)]
pub enum ServerError {
    #[error("unauthorized")]
    Unauthorized,
    #[error("Header not found")]
    HeaderNotFound(String),
    #[error("Other error")]
    Other(String),
}
