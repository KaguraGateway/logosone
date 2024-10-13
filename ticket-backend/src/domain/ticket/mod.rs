use thiserror::Error;

pub mod model;
pub mod repository;

#[derive(Error, Debug)]
pub enum DomainTickerError {
    #[error("Failed to database operation ticket: {0}")]
    FailedToTicketDbOperation(String),
}
