fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .include_file("mod.rs")
        .build_client(true)
        .build_server(true)
        .out_dir("src/")
        .compile(&["proto/ticket_service.proto"], &["proto/"])?;
    Ok(())
}
