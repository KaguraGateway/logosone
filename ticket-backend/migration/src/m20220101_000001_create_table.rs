use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Ticket::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Ticket::Id)
                            .string()
                            .char_len(24)
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Ticket::TicketNumber).unsigned().not_null())
                    .col(ColumnDef::new(Ticket::TicketPrefix).string().not_null())
                    .col(
                        ColumnDef::new(Ticket::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Ticket::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Ticket {
    Table,
    Id,
    TicketNumber,
    TicketPrefix,
    CreatedAt,
}
