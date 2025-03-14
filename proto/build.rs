fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .include_file("lib.rs")
        .build_client(true)
        .build_server(true)
        .out_dir("src/")
        .compile(&["proto/ticket/ticket_service.proto"], &["proto/"])?;
    Ok(())
}
