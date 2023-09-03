use cafelogos_grpc::cafelogos::{RequestIssueTicket, ResponseIssueTicket, Ticket};
use tonic::Status;

use crate::application::ticket::issue_ticket::IssueTicket;

pub async fn issue_ticket(
    usecase: &dyn IssueTicket,
    request: RequestIssueTicket,
) -> Result<ResponseIssueTicket, Status> {
    match usecase.issue_ticket(&request.prefix).await {
        Ok(ticket) => Ok(ResponseIssueTicket {
            ticket: Some(Ticket {
                id: ticket.id().to_string(),
                ticket_addr: format!("{}-{}", ticket.ticket_prefix(), ticket.ticket_number()),
                created_at: ticket.created_at().to_rfc3339(),
            })
        }),
        Err(e) => Err(e.into()),
    }
}
