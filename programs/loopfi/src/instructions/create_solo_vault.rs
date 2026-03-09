use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::state::*;

#[derive(Accounts)]
#[instruction(vault_name: String)]
pub struct CreateSoloVault<'info> {
    #[account(
        init,
        payer = owner,
        space = SoloVault::LEN,
        seeds = [owner.key().as_ref(), vault_name.as_bytes()],
        bump
    )]
    pub vault: Account<'info, SoloVault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = owner,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    pub token_mint: Account<'info, anchor_spl::token::Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<CreateSoloVault>,
    vault_name: String,
    unlock_time: i64,
    initial_amount: u64,
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    vault.owner = ctx.accounts.owner.key();
    vault.vault_name = vault_name;
    vault.balance = initial_amount;
    vault.unlock_time = unlock_time;
    vault.created_at = clock.unix_timestamp;
    vault.is_unlocked = false;

    msg!("Solo vault created: {} with unlock time: {}", vault.vault_name, vault.unlock_time);

    Ok(())
}
