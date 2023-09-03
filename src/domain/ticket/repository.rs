use async_trait::async_trait;
use shaku::Interface;

use super::{model::Ticket, DomainTickerError};

#[async_trait]
pub trait TicketRepository: Interface {
    async fn find_by_id(&self, id: String) -> Result<Option<Ticket>, DomainTickerError>;
    async fn find_last_ticket_by_prefix(&self, prefix: &str) -> Result<Option<Ticket>, DomainTickerError>;
    async fn save(&self, ticket: Ticket) -> Result<(), DomainTickerError>;
    async fn delete(&self, ticket: Ticket) -> Result<(), DomainTickerError>;
}
