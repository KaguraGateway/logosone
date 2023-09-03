use cafelogos_grpc::cafelogos::{
    ticket_service_server::TicketService, RequestIssueTicket, RequestRevokeTicket,
    ResponseIssueTicket, ResponseRevokeTicket,
};
use shaku::HasComponent;
use tonic::{Request, Response, Status};

use crate::TicketServiceImpl;
use crate::application::ticket::revoke_ticket::RevokeTicket;
use crate::presentation::ticket::issue_ticket;
use crate::application::ticket::issue_ticket::IssueTicket;

use self::ticket::revoke_ticket;

pub mod ticket;

#[tonic::async_trait]
impl TicketService for TicketServiceImpl {
    async fn issue_ticket(
        &self,
        request: Request<RequestIssueTicket>,
    ) -> Result<Response<ResponseIssueTicket>, Status> {
        let usecase: &dyn IssueTicket = self.module.resolve_ref();

        match issue_ticket::issue_ticket(usecase, request.into_inner()).await {
            Ok(response) => Ok(Response::new(response)),
            Err(status) => Err(status),
        }
    }

    async fn revoke_ticket(
        &self,
        request: Request<RequestRevokeTicket>,
    ) -> Result<Response<ResponseRevokeTicket>, Status> {
        let usecase: &dyn RevokeTicket = self.module.resolve_ref();

        match revoke_ticket::revoke_ticket(usecase, request.into_inner()).await {
            Ok(response) => Ok(Response::new(response)),
            Err(status) => Err(status),
        }
    }
}
