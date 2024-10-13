use tonic::Status;

use crate::{domain::ticket::DomainTickerError, application::ticket::ApplicationTicketError};

pub mod issue_ticket;
pub mod revoke_ticket;


impl From<ApplicationTicketError> for Status {
    fn from(value: ApplicationTicketError) -> Self {
        match value {
            ApplicationTicketError::TicketNotFound => Status::not_found("Ticket not found"),
            ApplicationTicketError::DomainTickerError(e) => e.into(),
        }
    }
}

impl From<DomainTickerError> for Status {
    fn from(value: DomainTickerError) -> Self {
        match value {
            DomainTickerError::FailedToTicketDbOperation(e) => {
                Status::internal(e.to_string())
            }
        }
    }
}
