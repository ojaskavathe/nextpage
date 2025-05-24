{
  description = "Nextpage flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default =
          with pkgs;
          mkShell {
            buildInputs = [
              nodejs
              bun
            ];
            shellHook = with pkgs; ''
              export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
              export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
              export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
              export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
              export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
            '';
          };
      }
    );
}
