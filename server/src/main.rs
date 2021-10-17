#![feature(backtrace)]
#[macro_use]
extern crate envconfig_derive;
extern crate clap;

use clap::Clap;

use juniper::{EmptyMutation, EmptySubscription, RootNode};
use rocket::fairing::AdHoc;
use rocket::{response::content, Rocket, State};
mod config;
mod endpoint_types;
mod guards;
mod oauth;
mod schema;
use envconfig::Envconfig;
use schema::{Context, Mutation, Schema};

use crate::{config::Config, schema::Query};

#[derive(Clap)]
#[clap(version = "1.0", author = "Me")]
struct Opts {
    #[clap(subcommand)]
    subcmd: Option<SubCommand>,
}

#[derive(Clap)]
enum SubCommand {
    CreateBlindTactics,
}

#[rocket::get("/")]
fn graphiql() -> content::Html<String> {
    juniper_rocket::graphiql_source("/graphql", None)
}

#[rocket::get("/graphql?<request>")]
fn get_graphql_handler(
    context: &State<Context>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&*schema, &*context)
}

#[rocket::post("/graphql", data = "<request>")]
fn post_graphql_handler(
    context: &State<Context>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&*schema, &*context)
}

#[rocket::main]
async fn main() {
    dotenv::dotenv().unwrap();

    fern::Dispatch::new()
        .format(|out, message, record| {
            out.finish(format_args!(
                // "{}[{}][{}] {}",
                "{}",
                // chrono::Local::now().format("[%Y-%m-%d][%H:%M:%S]"),
                // record.target(),
                // record.level(),
                message
            ))
        })
        .level(log::LevelFilter::Debug)
        .chain(std::io::stdout())
        .chain(fern::log_file("output.log").unwrap())
        .apply()
        .unwrap();

    color_eyre::install().unwrap();

    let opts: Opts = Opts::parse();

    match opts.subcmd {
        Some(SubCommand::CreateBlindTactics) => {
            blind_tactics::load_from_json();
        }
        None => {
            let _ = create_server().await.launch().await;
        }
    }
}
