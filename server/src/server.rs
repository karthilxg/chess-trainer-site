use juniper::{EmptyMutation, EmptySubscription, RootNode};
use rocket::fairing::AdHoc;
use rocket::{response::content, Rocket, State};
use envconfig::Envconfig;
use schema::{Context, Mutation, Schema};

use crate::{config::Config, schema::Query};

pub async fn create_server() -> Rocket<rocket::Ignite> {
    let config = Config::init().unwrap();
    Rocket::build()
        .manage(Context {})
        .manage(config.clone())
        .manage(Schema::new(
            Query,
            Mutation,
            EmptySubscription::<Context>::new(),
        ))
        .mount(
            "/api/",
            rocket::routes![
                graphiql,
                get_graphql_handler,
                post_graphql_handler,
                oauth::lichess_login,
                oauth::lichess_callback
            ],
        )
        .ignite()
        .await
        .unwrap();
}
