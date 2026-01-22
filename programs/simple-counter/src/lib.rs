use anchor_lang::prelude::*;

declare_id!("27bfK4FnpaW6CXbaiXP2MGttVg85E8nh6D6fBhEMQ2rT");

#[program]
pub mod simple_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;

        counter.count = 0;

        msg!("Counter account has been initialized!");
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;

        counter.count += 1;

        msg!("Counter has been incremented!");
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u32,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account( init,
        space = 8+Counter::INIT_SPACE, payer=user,
        seeds = [b"counter", user.key().as_ref()], bump)]
    pub counter: Account<'info, Counter>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account()]
    pub authority: Signer<'info>,

    #[account(mut,
        seeds=[b"counter", authority.key().as_ref()], bump)]
    pub counter: Account<'info, Counter>,
}
