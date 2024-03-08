/* Autogenerated file. Do not edit manually. */
import {
  getEvents,
} from "@dojoengine/utils";

export async function setupWorld(provider) {
  function actions() {
    const contract_name = "kingdom_lord::actions::kingdom_lord_controller";

    const spawn = async ({ account }) => {
      try {
        let { transaction_hash } = await provider.execute(
          account,
          contract_name,
          "spawn",
          []
        );
        let event = getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 300,
          })
        )
        return event
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const startUpgrade = async ({ account, id }) => {
      try {
        let { transaction_hash } = await provider.execute(
          account,
          contract_name,
          "start_upgrade",
          [id]
        );
        let event = getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 300,
          })
        )
        return event
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const finishUpgrade = async ({ account, id }) => {
      try {
        let { transaction_hash } = await provider.execute(
          account,
          contract_name,
          "finish_upgrade",
          [id]
        );
        let event = getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 300,
          })
        )
        return event
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const getBuildingsLevels = async (player) => {
      try {
        let data = await provider.callContract(
          contract_name,
          "get_buildings_levels",
          [player]
        );
        return data
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const getUnderUpgrading = async (player) => {
      try {
        let data = await provider.callContract(
          contract_name,
          "get_under_upgrading",
          [player]
        );
        return data
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const getGrowthRate = async (player) => {
      try {
        let data = await provider.callContract(
          contract_name,
          "get_growth_rate",
          [player]
        );
        return data
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const getUpgradeInfo = async (id, player) => {
      try {
        let data = await provider.callContract(
          contract_name,
          "get_upgrade_info",
          [id, player]
        );
        return data
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const getResource = async (player) => {
      try {
        let data = await provider.callContract(
          contract_name,
          "get_resource",
          [player]
        );
        return data
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    const getCompleteUpgrading = async (player) => {
      try {
        let data = await provider.callContract(
          contract_name,
          "get_complete_upgrading",
          [player]
        );
        return data
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    return { spawn, startUpgrade, getBuildingsLevels, getUnderUpgrading, getGrowthRate, getUpgradeInfo, finishUpgrade, getResource, getCompleteUpgrading };
  }
  return {
    actions: actions(),
  };
}