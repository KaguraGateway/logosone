use cafelogos_grpc::cafelogos::{RequestRevokeTicket, ResponseRevokeTicket};
use tonic::Status;

use crate::application::ticket::revoke_ticket::RevokeTicket;

pub async fn revoke_ticket(
    usecase: &dyn RevokeTicket,
    request: RequestRevokeTicket,
) -> Result<ResponseRevokeTicket, Status> {
    match usecase.revoke_ticket(request.id).await {
        Ok(_) => Ok(ResponseRevokeTicket {}),
        Err(e) => Err(e.into()),
    }
}
