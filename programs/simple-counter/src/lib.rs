use anchor_lang::prelude::*;

declare_id!("27bfK4FnpaW6CXbaiXP2MGttVg85E8nh6D6fBhEMQ2rT");

#[program]
pub mod simple_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
