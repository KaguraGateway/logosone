#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    Ok(cafelogos_ticket_backend::run_server().await?)
}
