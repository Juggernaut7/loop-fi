use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, transfer};

use crate::state::*;

#[derive(Accounts)]
pub struct WithdrawFromVault<'info> {
    #[account(mut)]
    pub vault: Account<'info, SoloVault>,

    pub owner: Signer<'info>,

    #[account(mut)]
    pub owner_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<WithdrawFromVault>,
    amount: u64,
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;

    require!(vault.owner == ctx.accounts.owner.key(), VaultError::Unauthorized);
    require!(vault.is_unlocked, VaultError::VaultNotUnlocked);
    require!(vault.balance >= amount, VaultError::InsufficientFunds);

    // Transfer tokens from vault to owner
    let cpi_accounts = Transfer {
        from: ctx.accounts.vault_token_account.to_account_info(),
        to: ctx.accounts.owner_token_account.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    transfer(cpi_ctx, amount)?;

    vault.balance -= amount;

    msg!("Withdrawn {} from vault", amount);

    Ok(())
}

#[error_code]
pub enum VaultError {
    Unauthorized,
    VaultNotUnlocked,
    InsufficientFunds,
}
