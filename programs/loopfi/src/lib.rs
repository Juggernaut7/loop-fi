use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("GLF8TRSdvNNjNB4z6TGaYHjNQngDTyJmAPiLn3b7TYq");

#[program]
pub mod loopfi {
    use super::*;

    // Solo Vault Instructions
    pub fn create_solo_vault(
        ctx: Context<CreateSoloVault>,
        vault_name: String,
        unlock_time: i64,
        initial_amount: u64,
    ) -> Result<()> {
        instructions::create_solo_vault::handler(ctx, vault_name, unlock_time, initial_amount)
    }

    pub fn deposit_to_vault(
        ctx: Context<DepositToVault>,
        amount: u64,
    ) -> Result<()> {
        instructions::deposit_to_vault::handler(ctx, amount)
    }

    pub fn unlock_vault(
        ctx: Context<UnlockVault>,
    ) -> Result<()> {
        instructions::unlock_vault::handler(ctx)
    }

    pub fn withdraw_from_vault(
        ctx: Context<WithdrawFromVault>,
        amount: u64,
    ) -> Result<()> {
        instructions::withdraw_from_vault::handler(ctx, amount)
    }

    // Group Pool Instructions
    pub fn create_group_pool(
        ctx: Context<CreateGroupPool>,
        pool_name: String,
        unlock_time: i64,
        members: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::create_group_pool::handler(ctx, pool_name, unlock_time, members)
    }

    pub fn join_group_pool(
        ctx: Context<JoinGroupPool>,
    ) -> Result<()> {
        instructions::join_group_pool::handler(ctx)
    }

    pub fn contribute_to_pool(
        ctx: Context<ContributeToPool>,
        amount: u64,
    ) -> Result<()> {
        instructions::contribute_to_pool::handler(ctx, amount)
    }

    pub fn distribute_pool_funds(
        ctx: Context<DistributePoolFunds>,
    ) -> Result<()> {
        instructions::distribute_pool_funds::handler(ctx)
    }
}
