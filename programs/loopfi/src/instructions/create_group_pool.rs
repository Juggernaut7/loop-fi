use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
#[instruction(pool_name: String)]
pub struct CreateGroupPool<'info> {
    #[account(
        init,
        payer = creator,
        space = GroupPool::LEN,
        seeds = [creator.key().as_ref(), pool_name.as_bytes()],
        bump
    )]
    pub pool: Account<'info, GroupPool>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateGroupPool>,
    pool_name: String,
    unlock_time: i64,
    members: Vec<Pubkey>,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let clock = Clock::get()?;

    pool.creator = ctx.accounts.creator.key();
    pool.pool_name = pool_name;
    pool.members = members;
    pool.contributions = vec![0; pool.members.len()];
    pool.total_balance = 0;
    pool.unlock_time = unlock_time;
    pool.created_at = clock.unix_timestamp;
    pool.is_distributed = false;

    msg!("Group pool created: {}", pool.pool_name);

    Ok(())
}
