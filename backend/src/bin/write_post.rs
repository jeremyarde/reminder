use sqlx::Connection;

fn main() -> Result<(), ()> {
    let conn = SqliteConnection::connect("sqlite::memory:").await?;

    sqlx::query("DELETE FROM table").execute(&mut conn).await?;

    return Ok(())
}