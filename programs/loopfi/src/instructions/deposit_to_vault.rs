use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, transfer};

use crate::state::*;

#[derive(Accounts)]
pub struct DepositToVault<'info> {
    #[account(mut)]
    pub vault: Account<'info, SoloVault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = owner,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub token_mint: Account<'info, anchor_spl::token::Mint>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<DepositToVault>,
    amount: u64,
) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    
    require!(vault.owner == ctx.accounts.owner.key(), VaultError::Unauthorized);
    require!(!vault.is_unlocked, VaultError::VaultAlreadyUnlocked);

    // Transfer tokens
    let cpi_accounts = Transfer {
        from: ctx.accounts.owner_token_account.to_account_info(),
        to: ctx.accounts.vault_token_account.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    transfer(cpi_ctx, amount)?;

    vault.balance += amount;

    msg!("Deposited {} to vault", amount);

    Ok(())
}

#[error_code]
pub enum VaultError {
    Unauthorized,
    VaultAlreadyUnlocked,
}
