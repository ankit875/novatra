/// Module implementing a managed fungible-asset pattern.
/// This module exposes a managed fungible-asset pattern where the **owner of the asset's
/// metadata object** can mint, transfer (ignoring `frozen`), burn, withdraw/merge, and
/// deposit tokens across fungible stores.
///
/// What you can do here:
/// 1) Mint tokens into fungible stores as the metadata owner.
/// 2) Move tokens between stores as the metadata owner (ignoring `frozen` flags).
/// 3) Burn tokens from stores as the metadata owner.
/// 4) Withdraw and merge tokens from multiple stores (metadata owner).
/// 5) Deposit tokens into stores (metadata owner).
module novatra_market::base_fungible_asset {
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata, FungibleStore, FungibleAsset};
    use aptos_framework::object::{Self, Object, ConstructorRef};
    use aptos_framework::primary_fungible_store;
    use std::error;
    use std::signer;
    use std::string::String;
    use std::option;


    /// Signer is not the metadata owner.
    const E_NOT_OWNER: u64 = 1;
    /// ref_flags must be length 3: [mint, transfer, burn].
    const E_BAD_REF_FLAGS_LEN: u64 = 2;
    /// Vector lengths must match.
    const E_VEC_LEN_MISMATCH: u64 = 3;
    /// Missing MintRef.
    const E_NO_MINT_REF: u64 = 4;
    /// Missing TransferRef.
    const E_NO_TRANSFER_REF: u64 = 5;
    /// Missing BurnRef.
    const E_NO_BURN_REF: u64 = 6;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Holds capability refs that let the metadata owner manage the asset lifecycle.
    struct CapRefs has key {
        mint_ref: Option<MintRef>,
        transfer_ref: Option<TransferRef>,
        burn_ref: Option<BurnRef>,
    }

    /// Create the metadata object and optionally materialize the mint/transfer/burn refs
    /// based on `ref_flags = [mint, transfer, burn]`.
    public fun initialize(
        constructor_ref: &ConstructorRef,
        maximum_supply: u128,
        name: String,
        symbol: String,
        decimals: u8,
        icon_uri: String,
        project_uri: String,
        ref_flags: vector<bool>,
    ) {
        assert!(vector::length(&ref_flags) == 3, error::invalid_argument(E_BAD_REF_FLAGS_LEN));
        let supply = if (maximum_supply != 0) {
            option::some(maximum_supply)
        } else {
            option::none()
        };

        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            supply,
            name,
            symbol,
            decimals,
            icon_uri,
            project_uri,
        );

        // Optionally mint capability refs for the creator/owner.
        let mint_ref = if (*vector::borrow(&ref_flags, 0)) {
            option::some(fungible_asset::generate_mint_ref(constructor_ref))
        } else {
            option::none()
        };
        let transfer_ref = if (*vector::borrow(&ref_flags, 1)) {
            option::some(fungible_asset::generate_transfer_ref(constructor_ref))
        } else {
            option::none()
        };
        let burn_ref = if (*vector::borrow(&ref_flags, 2)) {
            option::some(fungible_asset::generate_burn_ref(constructor_ref))
        } else {
            option::none()
        };

        let metadata_object_signer = object::generate_signer(constructor_ref);
        move_to(
            &metadata_object_signer,
            CapRefs { mint_ref, transfer_ref, burn_ref }
        )
    }

    /// Mint (as metadata owner) into **primary stores** of the given addresses.
    public entry fun mint_to_primary_stores(
        admin: &signer,
        asset: Object<Metadata>,
        to: vector<address>,
        amounts: vector<u64>
    ) acquires CapRefs {
        let receiver_primary_stores = vector::map(
            to,
            |addr| primary_fungible_store::ensure_primary_store_exists(addr, asset)
        );
        mint(admin, asset, receiver_primary_stores, amounts);
    }

    /// Mint (as metadata owner) into the provided fungible stores.
    public entry fun mint(
        admin: &signer,
        asset: Object<Metadata>,
        stores: vector<Object<FungibleStore>>,
        amounts: vector<u64>,
    ) acquires CapRefs {
        let length = vector::length(&stores);
        assert!(length == vector::length(&amounts), error::invalid_argument(E_VEC_LEN_MISMATCH));
        let mint_ref = authorized_borrow_mint_ref(admin, asset);
        let i = 0;
        while (i < length) {
            fungible_asset::mint_to(mint_ref, *vector::borrow(&stores, i), *vector::borrow(&amounts, i));
            i = i + 1;
        }
    }

    /// Transfer (as metadata owner, ignoring `frozen`) between **primary stores**.
    public entry fun transfer_between_primary_stores(
        admin: &signer,
        asset: Object<Metadata>,
        from: vector<address>,
        to: vector<address>,
        amounts: vector<u64>
    ) acquires CapRefs {
        let sender_primary_stores = vector::map(
            from,
            |addr| primary_fungible_store::primary_store(addr, asset)
        );
        let receiver_primary_stores = vector::map(
            to,
            |addr| primary_fungible_store::ensure_primary_store_exists(addr, asset)
        );
        transfer(admin, asset, sender_primary_stores, receiver_primary_stores, amounts);
    }

    /// Transfer (as metadata owner, ignoring `frozen`) between arbitrary fungible stores.
    public entry fun transfer(
        admin: &signer,
        asset: Object<Metadata>,
        sender_stores: vector<Object<FungibleStore>>,
        receiver_stores: vector<Object<FungibleStore>>,
        amounts: vector<u64>,
    ) acquires CapRefs {
        let length = vector::length(&sender_stores);
        assert!(length == vector::length(&receiver_stores), error::invalid_argument(E_VEC_LEN_MISMATCH));
        assert!(length == vector::length(&amounts), error::invalid_argument(E_VEC_LEN_MISMATCH));
        let transfer_ref = authorized_borrow_transfer_ref(admin, asset);
        let i = 0;
        while (i < length) {
            fungible_asset::transfer_with_ref(
                transfer_ref,
                *vector::borrow(&sender_stores, i),
                *vector::borrow(&receiver_stores, i),
                *vector::borrow(&amounts, i)
            );
            i = i + 1;
        }
    }

    /// Burn (as metadata owner) from **primary stores** of the given addresses.
    public entry fun burn_from_primary_stores(
        admin: &signer,
        asset: Object<Metadata>,
        from: vector<address>,
        amounts: vector<u64>
    ) acquires CapRefs {
        let primary_stores = vector::map(
            from,
            |addr| primary_fungible_store::primary_store(addr, asset)
        );
        burn(admin, asset, primary_stores, amounts);
    }

    /// Burn (as metadata owner) from the given fungible stores.
    public entry fun burn(
        admin: &signer,
        asset: Object<Metadata>,
        stores: vector<Object<FungibleStore>>,
        amounts: vector<u64>
    ) acquires CapRefs {
        let length = vector::length(&stores);
        assert!(length == vector::length(&amounts), error::invalid_argument(E_VEC_LEN_MISMATCH));
        let burn_ref = authorized_borrow_burn_ref(admin, asset);
        let i = 0;
        while (i < length) {
            fungible_asset::burn_from(burn_ref, *vector::borrow(&stores, i), *vector::borrow(&amounts, i));
            i = i + 1;
        };
    }

    /// Freeze/unfreeze **primary stores** so they cannot transfer or receive.
    public entry fun set_primary_stores_frozen_status(
        admin: &signer,
        asset: Object<Metadata>,
        accounts: vector<address>,
        frozen: bool
    ) acquires CapRefs {
        let primary_stores = vector::map(accounts, |acct| {
            primary_fungible_store::ensure_primary_store_exists(acct, asset)
        });
        set_frozen_status(admin, asset, primary_stores, frozen);
    }

    /// Freeze/unfreeze fungible stores so they cannot transfer or receive.
    public entry fun set_frozen_status(
        admin: &signer,
        asset: Object<Metadata>,
        stores: vector<Object<FungibleStore>>,
        frozen: bool
    ) acquires CapRefs {
        let transfer_ref = authorized_borrow_transfer_ref(admin, asset);
        vector::for_each(stores, |store| {
            fungible_asset::set_frozen_flag(transfer_ref, store, frozen);
        });
    }

    /// Withdraw (as metadata owner, ignoring `frozen`) from **primary stores** and return a merged FA.
    public fun withdraw_from_primary_stores(
        admin: &signer,
        asset: Object<Metadata>,
        from: vector<address>,
        amounts: vector<u64>
    ): FungibleAsset acquires CapRefs {
        let primary_stores = vector::map(
            from,
            |addr| primary_fungible_store::primary_store(addr, asset)
        );
        withdraw(admin, asset, primary_stores, amounts)
    }

    /// Withdraw (as metadata owner, ignoring `frozen`) from fungible stores and return a merged FA
    /// where returned.amount == sum(amounts).
    public fun withdraw(
        admin: &signer,
        asset: Object<Metadata>,
        stores: vector<Object<FungibleStore>>,
        amounts: vector<u64>
    ): FungibleAsset acquires CapRefs {
        let length = vector::length(&stores);
        assert!(length == vector::length(&amounts), error::invalid_argument(E_VEC_LEN_MISMATCH));
        let transfer_ref = authorized_borrow_transfer_ref(admin, asset);
        let i = 0;
        let sum = fungible_asset::zero(asset);
        while (i < length) {
            let fa = fungible_asset::withdraw_with_ref(
                transfer_ref,
                *vector::borrow(&stores, i),
                *vector::borrow(&amounts, i)
            );
            fungible_asset::merge(&mut sum, fa);
            i = i + 1;
        };
        sum
    }

    /// Deposit (as metadata owner, ignoring `frozen`) into **primary stores** from a single FA source.
    public fun deposit_to_primary_stores(
        admin: &signer,
        fa: &mut FungibleAsset,
        from: vector<address>,
        amounts: vector<u64>,
    ) acquires CapRefs {
        let primary_stores = vector::map(
            from,
            |addr| primary_fungible_store::ensure_primary_store_exists(addr, fungible_asset::asset_metadata(fa))
        );
        deposit(admin, fa, primary_stores, amounts);
    }

    /// Deposit (as metadata owner, ignoring `frozen`) into fungible stores.
    /// After completion, `fa.amount` is reduced by sum(amounts).
    public fun deposit(
        admin: &signer,
        fa: &mut FungibleAsset,
        stores: vector<Object<FungibleStore>>,
        amounts: vector<u64>
    ) acquires CapRefs {
        let length = vector::length(&stores);
        assert!(length == vector::length(&amounts), error::invalid_argument(E_VEC_LEN_MISMATCH));
        let transfer_ref = authorized_borrow_transfer_ref(admin, fungible_asset::asset_metadata(fa));
        let i = 0;
        while (i < length) {
            let split_fa = fungible_asset::extract(fa, *vector::borrow(&amounts, i));
            fungible_asset::deposit_with_ref(
                transfer_ref,
                *vector::borrow(&stores, i),
                split_fa,
            );
            i = i + 1;
        };
    }

    // -------------------------
    // Internal helpers
    // -------------------------

    /// Borrow immutable access to capability refs for this metadata (validates ownership).
    inline fun authorized_borrow_refs(
        owner: &signer,
        asset: Object<Metadata>,
    ): &CapRefs acquires CapRefs {
        assert!(object::is_owner(asset, signer::address_of(owner)), error::permission_denied(E_NOT_OWNER));
        borrow_global<CapRefs>(object::object_address(&asset))
    }

    /// Get MintRef or abort if absent.
    inline fun authorized_borrow_mint_ref(
        owner: &signer,
        asset: Object<Metadata>,
    ): &MintRef acquires CapRefs {
        let refs = authorized_borrow_refs(owner, asset);
        assert!(option::is_some(&refs.mint_ref), error::not_found(E_NO_MINT_REF));
        option::borrow(&refs.mint_ref)
    }

    /// Get TransferRef or abort if absent.
    inline fun authorized_borrow_transfer_ref(
        owner: &signer,
        asset: Object<Metadata>,
    ): &TransferRef acquires CapRefs {
        let refs = authorized_borrow_refs(owner, asset);
        assert!(option::is_some(&refs.transfer_ref), error::not_found(E_NO_TRANSFER_REF));
        option::borrow(&refs.transfer_ref)
    }

    /// Get BurnRef or abort if absent.
    inline fun authorized_borrow_burn_ref(
        owner: &signer,
        asset: Object<Metadata>,
    ): &BurnRef acquires CapRefs {
        let refs = authorized_borrow_refs(owner, asset);
        assert!(option::is_some(&refs.burn_ref), error::not_found(E_NO_BURN_REF));
        option::borrow(&refs.burn_ref)
    }

    // -------------------------
    // Tests
    // -------------------------
    #[test_only]
    use aptos_framework::object::object_from_constructor_ref;
    #[test_only]
    use std::string::utf8;
    use std::vector;
    use std::option::Option;

    #[test_only]
    fun create_test_mfa(creator: &signer): Object<Metadata> {
        let constructor_ref = &object::create_named_object(creator, b"APT");
        initialize(
            constructor_ref,
            0,
            utf8(b"Aptos Token"), /* name */
            utf8(b"APT"),         /* symbol */
            8,                    /* decimals */
            utf8(b"http://example.com/favicon.ico"), /* icon */
            utf8(b"http://example.com"),            /* project */
            vector[true, true, true]
        );
        object_from_constructor_ref<Metadata>(constructor_ref)
    }

    #[test(creator = @novatra_market)]
    fun test_basic_flow(
        creator: &signer,
    ) acquires CapRefs {
        let metadata = create_test_mfa(creator);
        let creator_address = signer::address_of(creator);
        let aaron_address = @0xface;

        mint_to_primary_stores(creator, metadata, vector[creator_address, aaron_address], vector[100, 50]);
        assert!(primary_fungible_store::balance(creator_address, metadata) == 100, 1);
        assert!(primary_fungible_store::balance(aaron_address, metadata) == 50, 2);

        set_primary_stores_frozen_status(creator, metadata, vector[creator_address, aaron_address], true);
        assert!(primary_fungible_store::is_frozen(creator_address, metadata), 3);
        assert!(primary_fungible_store::is_frozen(aaron_address, metadata), 4);

        transfer_between_primary_stores(
            creator,
            metadata,
            vector[creator_address, aaron_address],
            vector[aaron_address, creator_address],
            vector[10, 5]
        );
        assert!(primary_fungible_store::balance(creator_address, metadata) == 95, 5);
        assert!(primary_fungible_store::balance(aaron_address, metadata) == 55, 6);

        set_primary_stores_frozen_status(creator, metadata, vector[creator_address, aaron_address], false);
        assert!(!primary_fungible_store::is_frozen(creator_address, metadata), 7);
        assert!(!primary_fungible_store::is_frozen(aaron_address, metadata), 8);

        let fa = withdraw_from_primary_stores(
            creator,
            metadata,
            vector[creator_address, aaron_address],
            vector[25, 15]
        );
        assert!(fungible_asset::amount(&fa) == 40, 9);
        deposit_to_primary_stores(creator, &mut fa, vector[creator_address, aaron_address], vector[30, 10]);
        fungible_asset::destroy_zero(fa);

        burn_from_primary_stores(creator, metadata, vector[creator_address, aaron_address], vector[100, 50]);
        assert!(primary_fungible_store::balance(creator_address, metadata) == 0, 10);
        assert!(primary_fungible_store::balance(aaron_address, metadata) == 0, 11);
    }

    #[test(creator = @novatra_market, aaron = @0xface)]
    #[expected_failure(abort_code = 0x50001, location = Self)]
    fun test_permission_denied(
        creator: &signer,
        aaron: &signer
    ) acquires CapRefs {
        let metadata = create_test_mfa(creator);
        let creator_address = signer::address_of(creator);
        mint_to_primary_stores(aaron, metadata, vector[creator_address], vector[100]);
    }
}