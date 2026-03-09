use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct JoinGroupPool<'info> {
    #[account(mut)]
    pub pool: Account<'info, GroupPool>,

    pub member: Signer<'info>,
}

pub fn handler(ctx: Context<JoinGroupPool>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    require!(!pool.members.contains(&ctx.accounts.member.key()), PoolError::AlreadyMember);

    pool.members.push(ctx.accounts.member.key());
    pool.contributions.push(0);

    msg!("Member joined pool");

    Ok(())
}

#[error_code]
pub enum PoolError {
    AlreadyMember,
}
