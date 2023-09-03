use chrono::{DateTime, Utc};

#[derive(Clone)]
pub struct Ticket {
    id: TicketId,
    ticket_number: usize,
    ticket_prefix: String,
    created_at: DateTime<Utc>,
}

impl Ticket {
    pub fn new(ticket_number: usize, ticket_prefix: String) -> Self {
        Self {
            id: TicketId::new(),
            ticket_number,
            ticket_prefix,
            created_at: Utc::now(),
        }
    }

    pub fn rebuild(id: String, ticket_number: usize, ticket_prefix: String, created_at: DateTime<Utc>) -> Self {
        Self {
            id: TicketId::rebuild(id),
            ticket_number,
            ticket_prefix,
            created_at,
        }
    }

    pub fn id(&self) -> &str {
        &self.id.value()
    }

    pub fn ticket_number(&self) -> usize {
        self.ticket_number
    }

    pub fn ticket_prefix(&self) -> &str {
        &self.ticket_prefix
    }

    pub fn created_at(&self) -> DateTime<Utc> {
        self.created_at
    }
}

#[derive(Clone)]
pub struct TicketId {
    value: String,
}

impl TicketId {
    pub fn new() -> Self {
        Self { value: cuid::cuid2() }
    }

    pub fn rebuild(value: String) -> Self {
        Self { value }
    }

    pub fn value(&self) -> &str {
        &self.value
    }
}