use anchor_lang::prelude::*;
use anchor_spl::associated_token::create as ata_create;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, MintTo, Burn, InitializeMint};
use anchor_lang::solana_program::program::{invoke_signed};

declare_id!("AMMProgrm1111111111111111111111111111111111"); 

#[program]
pub mod amm {
    use super::*;

    pub fn create_pool(
        ctx: Context<CreatePool>,
        fee_numerator: u64,
        fee_denominator: u64,
    ) -> Result<()> {
        require!(fee_denominator > 0, AmmError::InvalidFeeDenominator);
        require!(fee_numerator < fee_denominator, AmmError::InvalidFee);

        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.payer.key();
        pool.token_a_mint = ctx.accounts.token_a_mint.key();
        pool.token_b_mint = ctx.accounts.token_b_mint.key();
        pool.vault_a = ctx.accounts.vault_a.key();
        pool.vault_b = ctx.accounts.vault_b.key();
        pool.lp_mint = ctx.accounts.lp_mint.key();
        pool.fee_numerator = fee_numerator;
        pool.fee_denominator = fee_denominator;
        pool.allowed_swapper = ctx.accounts.allowed_swapper.key();
        pool.bump = *ctx.bumps.get("pool").unwrap();
        let cpi_accounts = InitializeMint {
            mint: ctx.accounts.lp_mint.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let pool_seeds = &[
            b"pool",
            ctx.accounts.token_a_mint.key().as_ref(),
            ctx.accounts.token_b_mint.key().as_ref(),
            &[pool.bump],
        ];
        let signer = &[&pool_seeds[..]];
        token::initialize_mint(
            CpiContext::new_with_signer(cpi_program, cpi_accounts, signer),
            9,
            &ctx.accounts.pool.key(),
            Some(&ctx.accounts.pool.key()),
        )?;

        Ok(())
    }

    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount_a: u64,
        amount_b: u64,
    ) -> Result<()> {
        require!(amount_a > 0 && amount_b > 0, AmmError::ZeroAmount);

        let pool = &mut ctx.accounts.pool;

        let lp_mint_supply = ctx.accounts.lp_mint.supply;
        let lp_to_mint: u64 = if lp_mint_supply == 0 {
            let aa = amount_a as u128;
            let bb = amount_b as u128;
            let prod = aa.saturating_mul(bb);
            let sqrt = int_sqrt(prod);
            sqrt as u64
        } else {
            let reserve_a = ctx.accounts.vault_a.amount as u128;
            let reserve_b = ctx.accounts.vault_b.amount as u128;
            require!(reserve_a > 0 && reserve_b > 0, AmmError::ZeroReserve);

            let supply = lp_mint_supply as u128;

            let mint_a = (amount_a as u128)
                .checked_mul(supply)
                .ok_or(AmmError::NumericalOverflow)?
                .checked_div(reserve_a)
                .ok_or(AmmError::NumericalOverflow)?;

            let mint_b = (amount_b as u128)
                .checked_mul(supply)
                .ok_or(AmmError::NumericalOverflow)?
                .checked_div(reserve_b)
                .ok_or(AmmError::NumericalOverflow)?;

            let min = core::cmp::min(mint_a, mint_b);
            require!(min > 0, AmmError::InsufficientLiquidityProvided);
            min as u64
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let signer = ctx.accounts.user.to_account_info();

        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_a.to_account_info(),
            to: ctx.accounts.vault_a.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        token::transfer(
            CpiContext::new(cpi_program.clone(), cpi_accounts),
            amount_a,
        )?;

        // transfer B
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_b.to_account_info(),
            to: ctx.accounts.vault_b.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        token::transfer(
            CpiContext::new(cpi_program.clone(), cpi_accounts),
            amount_b,
        )?;
        let pool_seeds = &[
            b"pool",
            ctx.accounts.token_a_mint.key().as_ref(),
            ctx.accounts.token_b_mint.key().as_ref(),
            &[pool.bump],
        ];
        let signer_seeds = &[&pool_seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.lp_mint.to_account_info(),
            to: ctx.accounts.user_lp.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        token::mint_to(
            CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer_seeds),
            lp_to_mint,
        )?;

        Ok(())
    }

    pub fn remove_liquidity(
        ctx: Context<RemoveLiquidity>,
        lp_amount: u64,
    ) -> Result<()> {
        require!(lp_amount > 0, AmmError::ZeroAmount);

        let pool = &ctx.accounts.pool;
        let supply = ctx.accounts.lp_mint.supply;
        require!(supply >= lp_amount, AmmError::InsufficientSupply);

        // amount_a = reserve_a * lp_amount / supply
        let reserve_a = ctx.accounts.vault_a.amount as u128;
        let reserve_b = ctx.accounts.vault_b.amount as u128;
        let supply_u = supply as u128;
        let lp_u = lp_amount as u128;

        let amount_a = (reserve_a.checked_mul(lp_u).ok_or(AmmError::NumericalOverflow)?)
            .checked_div(supply_u)
            .ok_or(AmmError::NumericalOverflow)? as u64;
        let amount_b = (reserve_b.checked_mul(lp_u).ok_or(AmmError::NumericalOverflow)?)
            .checked_div(supply_u)
            .ok_or(AmmError::NumericalOverflow)? as u64;

        let pool_seeds = &[
            b"pool",
            ctx.accounts.token_a_mint.key().as_ref(),
            ctx.accounts.token_b_mint.key().as_ref(),
            &[pool.bump],
        ];
        let signer_seeds = &[&pool_seeds[..]];

        let cpi_accounts = Burn {
            mint: ctx.accounts.lp_mint.to_account_info(),
            from: ctx.accounts.user_lp.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        token::burn(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
            lp_amount,
        )?;
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_a.to_account_info(),
            to: ctx.accounts.user_token_a.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer_seeds),
            amount_a,
        )?;

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_b.to_account_info(),
            to: ctx.accounts.user_token_b.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer_seeds),
            amount_b,
        )?;

        Ok(())
    }

    pub fn swap(
        ctx: Context<Swap>,
        amount_in: u64, // amount of token provided by caller
        minimum_amount_out: u64,
        a_to_b: bool, // true: swap token A -> token B; false: B -> A
    ) -> Result<()> {
        require!(amount_in > 0, AmmError::ZeroAmount);
        let pool = &ctx.accounts.pool;
        require!(ctx.accounts.user.key() == pool.allowed_swapper, AmmError::Unauthorized);

        let reserve_a = ctx.accounts.vault_a.amount as u128;
        let reserve_b = ctx.accounts.vault_b.amount as u128;

        let fee_n = pool.fee_numerator as u128;
        let fee_d = pool.fee_denominator as u128;
        let amount_in_u = amount_in as u128;

        let amount_after_fee = amount_in_u
            .checked_mul(fee_d.checked_sub(fee_n).ok_or(AmmError::NumericalOverflow)?)
            .ok_or(AmmError::NumericalOverflow)?
            .checked_div(fee_d)
            .ok_or(AmmError::NumericalOverflow)?;

        let k = reserve_a
            .checked_mul(reserve_b)
            .ok_or(AmmError::NumericalOverflow)?;
        let new_x = if a_to_b {
            reserve_a.checked_add(amount_after_fee).ok_or(AmmError::NumericalOverflow)?
        } else {
            reserve_b.checked_add(amount_after_fee).ok_or(AmmError::NumericalOverflow)?
        };

        let out_reserve = k.checked_div(new_x).ok_or(AmmError::NumericalOverflow)?;
        let amount_out = if a_to_b {
            reserve_b.checked_sub(out_reserve).ok_or(AmmError::NumericalOverflow)?
        } else {
            reserve_a.checked_sub(out_reserve).ok_or(AmmError::NumericalOverflow)?
        };

        require!(amount_out > 0, AmmError::InsufficientOutputAmount);
        require!(amount_out as u64 >= minimum_amount_out, AmmError::SlippageExceeded);
        let cpi_program = ctx.accounts.token_program.to_account_info();

        if a_to_b {
            let cpi_accounts = Transfer {
                from: ctx.accounts.user_source.to_account_info(),
                to: ctx.accounts.vault_a.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            };
            token::transfer(CpiContext::new(cpi_program.clone(), cpi_accounts), amount_in)?;

            let pool_seeds = &[
                b"pool",
                ctx.accounts.token_a_mint.key().as_ref(),
                ctx.accounts.token_b_mint.key().as_ref(),
                &[pool.bump],
            ];
            let signer_seeds = &[&pool_seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.vault_b.to_account_info(),
                to: ctx.accounts.user_destination.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            };
            token::transfer(
                CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer_seeds),
                amount_out as u64,
            )?;
        } else {
            // B -> A
            let cpi_accounts = Transfer {
                from: ctx.accounts.user_source.to_account_info(),
                to: ctx.accounts.vault_b.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            };
            token::transfer(CpiContext::new(cpi_program.clone(), cpi_accounts), amount_in)?;

            let pool_seeds = &[
                b"pool",
                ctx.accounts.token_a_mint.key().as_ref(),
                ctx.accounts.token_b_mint.key().as_ref(),
                &[pool.bump],
            ];
            let signer_seeds = &[&pool_seeds[..]];
            let cpi_accounts = Transfer {
                from: ctx.accounts.vault_a.to_account_info(),
                to: ctx.accounts.user_destination.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            };
            token::transfer(
                CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer_seeds),
                amount_out as u64,
            )?;
        }

        Ok(())
    }
}
#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub vault_a: Pubkey, // ATA owned by pool PDA
    pub vault_b: Pubkey,
    pub lp_mint: Pubkey,
    pub fee_numerator: u64,
    pub fee_denominator: u64,
    pub allowed_swapper: Pubkey,
    pub bump: u8,
    pub _padding: [u8; 64],
}

#[derive(Accounts)]
#[instruction(fee_numerator: u64, fee_denominator: u64)]
pub struct CreatePool<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_a_mint: Account<'info, Mint>,
    pub token_b_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<Pool>(),
        seeds = [b"pool", token_a_mint.key().as_ref(), token_b_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub lp_mint: Signer<'info>,
    #[account(mut)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: Account<'info, TokenAccount>,

    pub allowed_swapper: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, has_one = token_a_mint, has_one = token_b_mint)]
    pub pool: Account<'info, Pool>,

    pub token_a_mint: Account<'info, Mint>,
    pub token_b_mint: Account<'info, Mint>,

    #[account(mut)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,

    #[account(mut)]
    pub lp_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_lp: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, has_one = token_a_mint, has_one = token_b_mint)]
    pub pool: Account<'info, Pool>,

    pub token_a_mint: Account<'info, Mint>,
    pub token_b_mint: Account<'info, Mint>,

    #[account(mut)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_b: Account<'info, TokenAccount>,

    #[account(mut)]
    pub lp_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_lp: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub user: Signer<'info>, 

    #[account(mut, has_one = token_a_mint, has_one = token_b_mint)]
    pub pool: Account<'info, Pool>,

    pub token_a_mint: Account<'info, Mint>,
    pub token_b_mint: Account<'info, Mint>,

    #[account(mut)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_source: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_destination: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}
=
#[error_code]
pub enum AmmError {
    #[msg("Invalid fee denominator")]
    InvalidFeeDenominator,
    #[msg("Invalid fee")]
    InvalidFee,
    #[msg("Zero amount")]
    ZeroAmount,
    #[msg("Numerical overflow")]
    NumericalOverflow,
    #[msg("Zero reserve")]
    ZeroReserve,
    #[msg("Insufficient liquidity provided")]
    InsufficientLiquidityProvided,
    #[msg("Insufficient supply")]
    InsufficientSupply,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Insufficient output amount")]
    InsufficientOutputAmount,
    #[msg("Slippage exceeded")]
    SlippageExceeded,
}

fn int_sqrt(x: u128) -> u128 {
    if x <= 1 {
        return x;
    }
    let mut left = 1u128;
    let mut right = x;
    while left <= right {
        let mid = (left + right) / 2;
        let sq = mid.saturating_mul(mid);
        if sq == x {
            return mid;
        } else if sq < x {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    right
}
