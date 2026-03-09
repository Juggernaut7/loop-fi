use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct DistributePoolFunds<'info> {
    #[account(mut)]
    pub pool: Account<'info, GroupPool>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<DistributePoolFunds>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let clock = Clock::get()?;

    require!(pool.creator == ctx.accounts.authority.key(), PoolError::Unauthorized);
    require!(clock.unix_timestamp >= pool.unlock_time, PoolError::UnlockTimeNotReached);
    require!(!pool.is_distributed, PoolError::AlreadyDistributed);

    pool.is_distributed = true;

    msg!("Pool funds distributed");

    Ok(())
}

#[error_code]
pub enum PoolError {
    Unauthorized,
    UnlockTimeNotReached,
    AlreadyDistributed,
}
