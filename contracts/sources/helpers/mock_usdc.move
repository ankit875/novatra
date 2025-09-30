// Mock USDC (fungible asset) for local testing
module novatra_market::mock_usdc_fa {
    use aptos_framework::object;
    use aptos_framework::fungible_asset::{Metadata};
    use aptos_framework::object::Object;

    use novatra_market::base_fungible_asset;

    use std::string::utf8;

    const ASSET_SYMBOL: vector<u8> = b"USDC";

    /// Creates the USDC-like metadata object and capability refs for local runs.
    fun init_module(admin: &signer) {
        let constructor_ref = &object::create_named_object(admin, ASSET_SYMBOL);
        base_fungible_asset::initialize(
            constructor_ref,
            0,                               /* maximum_supply: 0 = unlimited */
            utf8(b"Mock USDC Tokens"),       /* name */
            utf8(ASSET_SYMBOL),              /* symbol */
            6,                               /* decimals */
            utf8(b"http://example.com/favicon.ico"), /* icon */
            utf8(b"http://example.com"),     /* project */
            vector[true, true, true]         /* [mint, transfer, burn] refs */
        );
    }

    #[view]
    /// Returns the metadata object created by this module.
    public fun get_metadata(): Object<Metadata> {
        let metadata_address = object::create_object_address(&@novatra_market, ASSET_SYMBOL);
        object::address_to_object<Metadata>(metadata_address)
    }

    /// Mints into the recipient's primary store (requires metadata owner).
    public entry fun mint(admin: &signer, to: address, amount: u64) {
        base_fungible_asset::mint_to_primary_stores(admin, get_metadata(), vector[to], vector[amount]);
    }

    /// Burns from the sender's primary store (requires metadata owner).
    public entry fun burn(admin: &signer, from: address, amount: u64) {
        base_fungible_asset::burn_from_primary_stores(admin, get_metadata(), vector[from], vector[amount]);
    }

    // ======== Test helpers =========

    #[test_only]
    public fun init_module_for_testing(deployer: &signer) {
        init_module(deployer)
    }
}