use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct UnlockVault<'info> {
    #[account(mut)]
    pub vault: Account<'info, SoloVault>,

    pub owner: Signer<'info>,
}

pub fn handler(ctx: Context<UnlockVault>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    let clock = Clock::get()?;

    require!(vault.owner == ctx.accounts.owner.key(), VaultError::Unauthorized);
    require!(clock.unix_timestamp >= vault.unlock_time, VaultError::UnlockTimeNotReached);
    require!(!vault.is_unlocked, VaultError::AlreadyUnlocked);

    vault.is_unlocked = true;

    msg!("Vault unlocked");

    Ok(())
}

#[error_code]
pub enum VaultError {
    Unauthorized,
    UnlockTimeNotReached,
    AlreadyUnlocked,
}
