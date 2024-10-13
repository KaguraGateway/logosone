use async_trait::async_trait;
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter, ColumnTrait, QueryOrder, sea_query::OnConflict};
use sea_orm::ActiveValue::Set;
use shaku::Component;

use crate::{domain::ticket::{repository::TicketRepository, model::Ticket, DomainTickerError}, infra::dao::ticket::{self, Column}};

#[derive(Component)]
#[shaku(interface = TicketRepository)]
pub struct TicketRepositoryDb {
    #[shaku(default)]
    db: DatabaseConnection,
}

#[async_trait]
impl TicketRepository for TicketRepositoryDb {
    async fn find_by_id(&self, id: String) -> Result<Option<Ticket>, DomainTickerError> {
        Ok(ticket::Entity::find_by_id(id)
            .one(&self.db)
            .await
            .map_err(|e| DomainTickerError::FailedToTicketDbOperation(e.to_string()))?
            .map(|v| v.into())
        )
    }

    async fn find_last_ticket_by_prefix(&self, prefix: &str) -> Result<Option<Ticket>, DomainTickerError> {
        Ok(ticket::Entity::find()
            .filter(Column::TicketPrefix.contains(prefix))
            .order_by_desc(Column::TicketNumber)
            .one(&self.db)
            .await
            .map_err(|e| DomainTickerError::FailedToTicketDbOperation(e.to_string()))?
            .map(|v| v.into())
        )
    }

    async fn save(&self, ticket: Ticket) -> Result<(), DomainTickerError> {
        let model = ticket::ActiveModel {
            id: Set(ticket.id().to_string()),
            ticket_number: Set(ticket.ticket_number().try_into().unwrap()),
            ticket_prefix: Set(ticket.ticket_prefix().to_string()),
            created_at: Set(ticket.created_at().into()),
        };

        ticket::Entity::insert(model)
            .on_conflict(
                OnConflict::column(ticket::Column::Id)
                .do_nothing()
                .to_owned()
            )
            .exec(&self.db)
            .await
            .map_err(|e| DomainTickerError::FailedToTicketDbOperation(e.to_string()))?;

        Ok(())
    }

    async fn delete(&self, ticket: Ticket) -> Result<(), DomainTickerError> {
        ticket::Entity::delete_by_id(ticket.id().to_string())
            .exec(&self.db)
            .await
            .map_err(|e| DomainTickerError::FailedToTicketDbOperation(e.to_string()))?;

        Ok(())
    }
}

impl Into<Ticket> for ticket::Model {
    fn into(self) -> Ticket {
        Ticket::rebuild(
            self.id,
            self.ticket_number.try_into().unwrap(),
            self.ticket_prefix,
            self.created_at.into(),
        )
    }
}
