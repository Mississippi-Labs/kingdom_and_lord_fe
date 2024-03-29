import { getSyncEntities } from "@dojoengine/state";
import { DojoProvider } from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { setupWorld } from "./generated";


export async function setup({ ...config }) {
  console.log("config", config);
  // torii client
  const toriiClient = await torii.createClient([], {
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    worldAddress: config.manifest.world.address || "",
  });

  // create contract components
  const contractComponents = defineContractComponents(world);

  console.log("contractComponents", contractComponents);
  // create client components
  const clientComponents = createClientComponents({ contractComponents });

  // fetch all existing entities from torii
  await getSyncEntities(toriiClient, contractComponents);

  const client = await setupWorld(
    new DojoProvider(config.manifest, config.rpcUrl)
  );

  return {
    client,
    clientComponents,
    contractComponents,
    systemCalls: createSystemCalls(
      { client }
    ),
    config,
  };
}
