use std::sync::Arc;

use async_trait::async_trait;
use shaku::{Interface, Component};

use crate::domain::ticket::repository::TicketRepository;

use super::ApplicationTicketError;

#[async_trait]
pub trait RevokeTicket: Interface {
    async fn revoke_ticket(&self, id: String) -> Result<(), ApplicationTicketError>;
}

#[derive(Component)]
#[shaku(interface = RevokeTicket)]
pub struct RevokeTicketUseCase {
    #[shaku(inject)]
    repository: Arc<dyn TicketRepository>,
}

#[async_trait]
impl RevokeTicket for RevokeTicketUseCase {
    async fn revoke_ticket(&self, id: String) -> Result<(), ApplicationTicketError> {
        let ticket = self.repository.find_by_id(id).await?;

        match ticket {
            Some(ticket) => {
                self.repository.delete(ticket).await?;
                Ok(())
            },
            None => Err(ApplicationTicketError::TicketNotFound),
        }
    }
}
