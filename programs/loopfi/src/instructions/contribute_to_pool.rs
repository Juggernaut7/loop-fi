use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct ContributeToPool<'info> {
    #[account(mut)]
    pub pool: Account<'info, GroupPool>,

    pub contributor: Signer<'info>,
}

pub fn handler(
    ctx: Context<ContributeToPool>,
    amount: u64,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    
    let member_index = pool
        .members
        .iter()
        .position(|m| m == &ctx.accounts.contributor.key())
        .ok_or(PoolError::NotAMember)?;

    pool.contributions[member_index] += amount;
    pool.total_balance += amount;

    msg!("Contributed {} to pool", amount);

    Ok(())
}

#[error_code]
pub enum PoolError {
    NotAMember,
}
