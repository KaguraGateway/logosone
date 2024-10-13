use std::sync::Arc;

use async_trait::async_trait;
use shaku::{Component, Interface};

use crate::domain::ticket::{model::Ticket, repository::TicketRepository};

use super::ApplicationTicketError;


#[async_trait]
pub trait IssueTicket: Interface {
    async fn issue_ticket(&self, prefix: &str) -> Result<Ticket, ApplicationTicketError>;
}

#[derive(Component)]
#[shaku(interface = IssueTicket)]
pub struct IssueTicketUseCase {
    #[shaku(inject)]
    repository: Arc<dyn TicketRepository>,
}

#[async_trait]
impl IssueTicket for IssueTicketUseCase {
    async fn issue_ticket(&self, prefix: &str) -> Result<Ticket, ApplicationTicketError> {
        let last_ticket = self.repository.find_last_ticket_by_prefix(prefix).await?;

        let ticket_number = match last_ticket {
            Some(ticket) => ticket.ticket_number() + 1,
            None => 1,
        };

        let ticket = Ticket::new(ticket_number, prefix.to_string());

        self.repository.save(ticket.clone()).await?;

        Ok(ticket)
    }
}
