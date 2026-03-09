// Solana Vault Service - Interface with Anchor programs on Solana blockchain
import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

const PROGRAM_ID = new PublicKey('GLF8TRSdvNNjNB4z6TGaYHjNQngDTyJmAPiLn3b7TYq');
const SOLANA_NETWORK = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_NETWORK, 'confirmed');

class SolanaVaultService {
  constructor() {
    this.connection = connection;
    this.programId = PROGRAM_ID;
  }

  // Create a solo vault
  async createSoloVault(wallet, vaultName, unlockTime, initialAmount) {
    try {
      console.log(`Creating solo vault: ${vaultName}`);
      
      if (!wallet || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // TODO: Build and send transaction
      // This will call the create_solo_vault instruction on the Solana program
      
      const transaction = {
        instructions: [
          {
            programId: this.programId,
            keys: [
              { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            ],
            data: Buffer.from([
              0, // Discriminator for create_solo_vault
              ...Buffer.from(vaultName),
            ])
          }
        ],
        signers: [wallet],
      };

      console.log('Vault creation transaction prepared');
      return transaction;
    } catch (error) {
      console.error('Error creating solo vault:', error);
      throw error;
    }
  }

  // Deposit to vault
  async depositToVault(wallet, vaultAddress, amount) {
    try {
      console.log(`Depositing ${amount} to vault`);
      
      if (!wallet || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // TODO: Build deposit transaction
      // Convert amount to lamports if needed
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = {
        instructions: [
          {
            programId: this.programId,
            keys: [
              { pubkey: vaultAddress, isSigner: false, isWritable: true },
              { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            ],
            data: Buffer.from([1]) // Discriminator for deposit
          }
        ],
        signers: [wallet],
      };

      console.log('Deposit transaction prepared');
      return transaction;
    } catch (error) {
      console.error('Error depositing to vault:', error);
      throw error;
    }
  }

  // Unlock vault
  async unlockVault(wallet, vaultAddress) {
    try {
      console.log('Unlocking vault');
      
      if (!wallet || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      const transaction = {
        instructions: [
          {
            programId: this.programId,
            keys: [
              { pubkey: vaultAddress, isSigner: false, isWritable: true },
              { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
            ],
            data: Buffer.from([2]) // Discriminator for unlock
          }
        ],
        signers: [wallet],
      };

      console.log('Unlock transaction prepared');
      return transaction;
    } catch (error) {
      console.error('Error unlocking vault:', error);
      throw error;
    }
  }

  // Withdraw from vault
  async withdrawFromVault(wallet, vaultAddress, amount) {
    try {
      console.log(`Withdrawing ${amount} from vault`);
      
      if (!wallet || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = {
        instructions: [
          {
            programId: this.programId,
            keys: [
              { pubkey: vaultAddress, isSigner: false, isWritable: true },
              { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            ],
            data: Buffer.from([3]) // Discriminator for withdraw
          }
        ],
        signers: [wallet],
      };

      console.log('Withdraw transaction prepared');
      return transaction;
    } catch (error) {
      console.error('Error withdrawing from vault:', error);
      throw error;
    }
  }

  // Create group pool
  async createGroupPool(wallet, poolName, unlockTime, members) {
    try {
      console.log(`Creating group pool: ${poolName}`);
      
      if (!wallet || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      const transaction = {
        instructions: [
          {
            programId: this.programId,
            keys: [
              { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            ],
            data: Buffer.from([4]) // Discriminator for create_group_pool
          }
        ],
        signers: [wallet],
      };

      console.log('Group pool creation transaction prepared');
      return transaction;
    } catch (error) {
      console.error('Error creating group pool:', error);
      throw error;
    }
  }

  // Fetch user vaults
  async getUserVaults(userAddress) {
    try {
      console.log(`Fetching vaults for user: ${userAddress}`);
      
      // TODO: Query accounts with owner = userAddress
      // Use getProgramAccounts to fetch all vaults owned by user
      
      const vaults = [];
      
      console.log(`Found ${vaults.length} vaults`);
      return vaults;
    } catch (error) {
      console.error('Error fetching user vaults:', error);
      return [];
    }
  }

  // Get vault details
  async getVaultDetails(vaultAddress) {
    try {
      // TODO: Fetch account data for vault
      const vault = null;
      
      return vault;
    } catch (error) {
      console.error('Error fetching vault details:', error);
      return null;
    }
  }

  // Check if vault can be unlocked
  async canUnlockVault(vaultAddress) {
    try {
      const vault = await this.getVaultDetails(vaultAddress);
      if (!vault) return false;

      const now = Math.floor(Date.now() / 1000);
      return now >= vault.unlockTime && !vault.isUnlocked;
    } catch (error) {
      console.error('Error checking vault unlock status:', error);
      return false;
    }
  }
}

export default new SolanaVaultService();
