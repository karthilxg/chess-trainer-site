use std::fmt::Display;
use uuid::Uuid;

use juniper::{
    graphql_object, graphql_value, EmptySubscription, FieldError, FieldResult, GraphQLEnum,
    GraphQLInputObject, GraphQLObject, ScalarValue,
};

// #[derive(GraphQLEnum)]
// enum Episode {
//     NewHope,
//     Empire,
//     Jedi,
// }

#[derive(GraphQLEnum)]
enum Color {
    Black,
    White,
}

#[derive(GraphQLObject)]
#[graphql(description = "A user profile")]
pub struct User {
    id: Uuid,
    name: String,
}

#[derive(GraphQLObject)]
#[graphql(description = "A repertoire, for white black or both")]
pub struct Repertoire {
    id: Uuid,
    author: Uuid,
    description: String,
    black: Option<SideRepertoire>,
    white: Option<SideRepertoire>,
}

#[derive(GraphQLObject)]
#[graphql(description = "A repertoire for a specific side")]
pub struct SideRepertoire {
    id: Uuid,
    color: Color,
    author: Uuid,
    moves: Vec<RepertoireMove>,
}

#[derive(GraphQLObject)]
#[graphql(description = "A specific move in a repertoire")]
pub struct RepertoireMove {
    id: String,
    move_san: String,
    next_moves: Vec<Uuid>,
    comment: Option<String>,
}

// There is also a custom derive for mapping GraphQL input objects.

#[derive(GraphQLInputObject)]
#[graphql(description = "")]
pub struct NewRepertoireMove {
    comment: Option<String>,
    move_san: String,
}

// Now, we create our root Query and Mutation types with resolvers by using the
// object macro.
// Objects can have contexts that allow accessing shared state like a database
// pool.

pub struct Context {
    // TODO: pool
}

// To make our context usable by Juniper, we have to implement a marker trait.
impl juniper::Context for Context {}

pub struct Query;

#[graphql_object(
    // Here we specify the context type for the object.
    // We need to do this in every type that
    // needs access to the context.
    context = Context,
)]
impl Query {
    fn api_version() -> &str {
        "1.0"
    }

    fn repertoires(context: &Context) -> FieldResult<Vec<Repertoire>> {
        // Get a db connection.
        Ok(vec![])
    }
}

// Now, we do the same for our Mutation type.

pub struct Mutation;

#[graphql_object(
    context = Context,

    // If we need to use `ScalarValue` parametrization explicitly somewhere
    // in the object definition (like here in `FieldResult`), we should
    // declare an explicit type parameter for that, and specify it.
    scalar = S,
)]
impl<S: ScalarValue + Display> Mutation {
    fn add_move_to_repertoire(
        context: &Context,
        parent_move: Option<Uuid>,
        new_move: NewRepertoireMove,
    ) -> FieldResult<RepertoireMove, S> {
        Err(FieldError::new(
            "Blah",
            graphql_value!({"internal error": "blah"}),
        ))
    }
}

// A root schema consists of a query, a mutation, and a subscription.
// Request queries can be executed against a RootNode.
pub type Schema = juniper::RootNode<'static, Query, Mutation, EmptySubscription<Context>>;
