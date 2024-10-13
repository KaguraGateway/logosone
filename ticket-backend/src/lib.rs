use std::env;

use application::ticket::{issue_ticket::IssueTicketUseCase, revoke_ticket::RevokeTicketUseCase};
use cafelogos_grpc::cafelogos::ticket::ticket_service_server::TicketServiceServer;
use dotenv::dotenv;
use infra::ticket::db::{TicketRepositoryDb, TicketRepositoryDbParameters};
use sea_orm::Database;
use shaku::module;
use tonic::transport::Server;

pub mod application;
pub mod domain;
pub mod infra;
pub mod presentation;

pub async fn run_server() -> Result<(), Box<dyn std::error::Error>> {
    if env::var("DATABASE_URL").is_err() {
        dotenv().ok();
    }

    println!("Starting server...");

    let db = Database::connect(env::var("DATABASE_URL")?).await?;
    let port = env::var("PORT")?;

    let module: MyModule = MyModule::builder()
        .with_component_parameters::<TicketRepositoryDb>(TicketRepositoryDbParameters { db })
        .build();

    let addr = format!("0.0.0.0:{port}").parse().unwrap();
    let service = TicketServiceServer::new(TicketServiceImpl { module });

    println!("Server listening on: {}", addr);

    Server::builder().add_service(service).serve(addr).await?;

    Ok(())
}

module! {
    MyModule {
        components = [TicketRepositoryDb, IssueTicketUseCase, RevokeTicketUseCase],
        providers = []
    }
}

pub struct TicketServiceImpl {
    module: MyModule,
}
