use envconfig::Envconfig;
use std::env;

#[derive(Envconfig, Clone)]
pub struct Config {
    #[envconfig(from = "DOJO_SITE_URL")]
    pub site_url: String,
}
