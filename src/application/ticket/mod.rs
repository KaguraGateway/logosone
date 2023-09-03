use thiserror::Error;

use crate::domain::ticket::DomainTickerError;

pub mod issue_ticket;
pub mod revoke_ticket;

#[derive(Debug, Error)]
pub enum ApplicationTicketError {
    #[error("DomainTickerError: {0}")]
    DomainTickerError(#[from] DomainTickerError),
    #[error("Ticket not found")]
    TicketNotFound,
}
