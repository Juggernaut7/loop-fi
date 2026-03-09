use anchor_lang::prelude::*;

#[account]
pub struct SoloVault {
    pub owner: Pubkey,
    pub vault_name: String,
    pub balance: u64,
    pub unlock_time: i64,
    pub created_at: i64,
    pub is_unlocked: bool,
}

impl SoloVault {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        4 + 32 + // vault_name (string)
        8 + // balance
        8 + // unlock_time
        8 + // created_at
        1; // is_unlocked
}

#[account]
pub struct GroupPool {
    pub creator: Pubkey,
    pub pool_name: String,
    pub members: Vec<Pubkey>,
    pub contributions: Vec<u64>,
    pub total_balance: u64,
    pub unlock_time: i64,
    pub created_at: i64,
    pub is_distributed: bool,
}

impl GroupPool {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator
        4 + 32 + // pool_name (string)
        4 + (32 * 10) + // members (up to 10)
        4 + (8 * 10) + // contributions
        8 + // total_balance
        8 + // unlock_time
        8 + // created_at
        1; // is_distributed
}

#[account]
pub struct UserVaultInfo {
    pub user: Pubkey,
    pub vaults: Vec<Pubkey>,
    pub total_deposited: u64,
    pub total_unlocked: u64,
}

impl UserVaultInfo {
    pub const LEN: usize = 8 + // discriminator
        32 + // user
        4 + (32 * 20) + // vaults (up to 20)
        8 + // total_deposited
        8; // total_unlocked
}
